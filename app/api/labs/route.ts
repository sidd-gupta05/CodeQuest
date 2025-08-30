import { db } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

type TimeSlotInput = {
  date: string;
  time: string;
};

export async function GET() {
  try {
    const labs = await db.lab.findMany({
      include: { details: true, timeSlots: true },
    });
    // console.log('Fetched labs:', labs);

    const mapped = labs.map((lab) => {
      const d = lab.details; // details is an object, not an array
      const groupedSlots: {
        [K in 'Morning' | 'Afternoon' | 'Evening']: string[];
      } = {
        Morning: [],
        Afternoon: [],
        Evening: [],
      };
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
        nextAvailable:
        d?.nextAvailable?.toISOString().split('T')[0] || 'Not Available',
        rating: d?.rating || 0,
        experience: d?.experienceYears || 0,
        isLoved: d?.isLoved || false,
        image: d?.imageUrl,
        collectionTypes: d?.collectionTypes || [],
        timeSlots: groupedSlots,
        latitude: d?.latitude ?? null,
        longitude: d?.longitude ?? null,
      };
    });

    return new Response(JSON.stringify(mapped), { status: 200 });
  } catch (e) {
    console.error(e);
    console.log('Error fetching labs:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      testType,
      nextAvailable,
      experienceYears,
      imageUrl,
      collectionTypes,
      latitude,
      longitude,
      isAvailable,
    } = body;

    const supabase = await createClient(cookies());
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (!user || error) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
      });
    }

    const lab = await db.lab.findUnique({ where: { userId: user.id } });
    if (!lab) {
      return new Response(JSON.stringify({ error: 'Lab not found' }), {
        status: 404,
      });
    }

    await db.labDetails.upsert({
      where: { labId: lab.id },
      update: {
        testType,
        experienceYears: experienceYears ?? null,
        imageUrl,
        collectionTypes: Array.isArray(collectionTypes)
          ? collectionTypes
          : (collectionTypes?.split(',').map((s: string) => s.trim()) ?? []),
        nextAvailable:
          nextAvailable?.length > 0 ? new Date(nextAvailable[0].date) : null,
        latitude: latitude ?? 0.0,
        longitude: longitude ?? 0.0,
        isLoved: isAvailable ?? false,
      },
      create: {
        id: uuidv4(),
        labId: lab.id,
        testType,
        experienceYears: experienceYears ?? null,
        imageUrl,
        collectionTypes: Array.isArray(collectionTypes)
          ? collectionTypes
          : (collectionTypes?.split(',').map((s: string) => s.trim()) ?? []),
        nextAvailable:
          nextAvailable?.length > 0 ? new Date(nextAvailable[0].date) : null,
        latitude: latitude ?? 0.0,
        longitude: longitude ?? 0.0,
        isLoved: isAvailable ?? false,
      },
    });

    if (nextAvailable && nextAvailable.length > 0) {
      await db.timeSlot.deleteMany({ where: { labId: lab.id } });
      await db.timeSlot.createMany({
        data: nextAvailable.map((slot: TimeSlotInput) => ({
          id: uuidv4(),
          labId: lab.id,
          date: new Date(slot.date),
          time: slot.time,
        })),
      });
    }

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
