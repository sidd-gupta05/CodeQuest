import { db } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

type TimeSlotInput = {
  date: string;
  time: string;
};

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
      isAvailable
    } = body;

    const supabase = await createClient(cookies());
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    const lab = await db.lab.findUnique({ where: { userId: user.id } });
    if (!lab) {
      return new Response(JSON.stringify({ error: 'Lab not found' }), { status: 404 });
    }

    await db.labDetails.upsert({
      where: { labId: lab.id },
      update: {
        testType,
        experienceYears: experienceYears ?? null,
        imageUrl,
        collectionTypes: Array.isArray(collectionTypes) ? collectionTypes : (collectionTypes?.split(',').map((s: string) => s.trim()) ?? []),
        nextAvailable: nextAvailable?.length > 0 ? new Date(nextAvailable[0].date) : null,
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
        collectionTypes: Array.isArray(collectionTypes) ? collectionTypes : (collectionTypes?.split(',').map((s: string) => s.trim()) ?? []),
        nextAvailable: nextAvailable?.length > 0 ? new Date(nextAvailable[0].date) : null,
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

    return new Response(JSON.stringify({ message: 'Lab details updated successfully' }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}


export async function GET(req: Request) {

  if (req.headers.get('x-service-key') !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
}

  try {
    const labs = await db.lab.findMany({
      include: { details: true, timeSlots: true }
    });

    return new Response(JSON.stringify(labs), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
