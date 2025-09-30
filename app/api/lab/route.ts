// app/api/lab/route.ts
import { db } from '@/lib/prisma';
import { supabase } from '@/utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const labs = await db.lab.findMany({
      include: { details: true, timeSlots: true },
    });

    const mapped = labs.map((lab) => {
      const d = lab.details;

      const groupedSlots: {
        Morning: string[];
        Afternoon: string[];
        Evening: string[];
      } = { Morning: [], Afternoon: [], Evening: [] };

      lab.timeSlots.forEach((slot) => {
        const key =
          slot.session?.charAt(0).toUpperCase() +
          slot.session.slice(1).toLowerCase();
        if (key === 'Morning' || key === 'Afternoon' || key === 'Evening') {
          groupedSlots[key].push(slot.time);
        }
      });

      return {
        id: lab.id,
        name: d?.labName || '',
        testType: d?.testType || '',
        location: lab.labLocation,
        nextAvailable: d?.nextAvailable?.toISOString().split('T')[0] || null,
        rating: d?.rating || 0,
        experience: d?.experienceYears || 0,
        isLoved: d?.isLoved || false,
        isAvailable: d?.isAvailable ?? true,
        image: d?.imageUrl || '',
        collectionTypes: d?.collectionTypes || [],
        latitude: d?.latitude ?? null,
        longitude: d?.longitude ?? null,
        timeSlots: groupedSlots, // ✅ now included
      };
    });

    return Response.json(mapped);
  } catch (e) {
    console.error('Error fetching labs:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

//TODO: work on POST req Ui and how to do when google auth
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      labName,
      testType,
      // nextAvailable,
      experienceYears,
      imageUrl,
      collectionTypes,
      latitude,
      longitude,
      isAvailable,
      isLoved,
      rating,
      pathlabId
      // timeSlots, // array of { time, session }
    } = body;

    // const {
    //   data: { user },
    //   error,
    // } = await supabase.auth.getUser();

    // if (!user || error) {
    //   return new Response(JSON.stringify({ error: 'Not authenticated' }), {
    //     status: 401,
    //   });
    // }

    // Find lab belonging to this user
    // const lab = await db.lab.findUnique({ where: { userId: user.id } });
    // if (!lab) {
    //   return new Response(JSON.stringify({ error: 'Lab not found' }), {
    //     status: 404,
    //   });
    // }

    // Upsert LabDetails
    await db.labDetails.upsert({
      where: { labId: pathlabId },
      update: {
        labName,
        testType,
        experienceYears: experienceYears ?? null,
        imageUrl,
        collectionTypes: Array.isArray(collectionTypes)
          ? collectionTypes
          : (collectionTypes?.split(',').map((s: string) => s.trim()) ?? []),
        latitude: latitude ?? 0.0,
        longitude: longitude ?? 0.0,
        isLoved: isLoved ?? false,
        isAvailable: isAvailable ?? true,
        // rating: rating ?? null,
      },
      create: {
        id: uuidv4(), 
        labId: pathlabId,
        labName,
        testType,
        experienceYears: experienceYears ?? null,
        imageUrl,
        collectionTypes: Array.isArray(collectionTypes)
          ? collectionTypes
          : (collectionTypes?.split(',').map((s: string) => s.trim()) ?? []),
        latitude: latitude ?? 0.0,
        longitude: longitude ?? 0.0,
        isLoved: isLoved ?? false,
        isAvailable: isAvailable ?? true,
        // rating: rating ?? null,
      },
    });

    // Reset and insert timeSlots
    // if (timeSlots && timeSlots.length > 0) {
    //   await db.labTimeSlot.deleteMany({ where: { labId: lab.id } });
    //   await db.labTimeSlot.createMany({
    //     data: timeSlots.map((slot: { time: string; session: string }) => ({
    //       id: uuidv4(),
    //       labId: lab.id,
    //       time: slot.time,
    //       session: slot.session.toUpperCase(), // MORNING / AFTERNOON / EVENING
    //     })),
    //   });
    // }

    return new Response(
      JSON.stringify({ message: 'Lab details updated successfully' }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
