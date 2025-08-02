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
      labId,
      labName,
      testType,
      nextAvailable,
      experienceYears,
      imageUrl,
      collectionTypes,
    } = body;

    const supabase = await createClient(cookies());
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log('User is ', user);

    if (!user || error) {
      console.error('Authentication error:', error);
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
      });
    }

    // 2️⃣ Check if lab exists
    const lab = await db.lab.findUnique({
      where: { userId: user.id }, 
    });

    if (!lab) {
      return new Response(JSON.stringify({ error: 'Lab not found' }), {
        status: 404,
      });
    }

    await db.labDetails.upsert({
      where: { labId: lab.id },
      update: {
        testType,
        experienceYears: experienceYears ? parseInt(experienceYears) : null,
        imageUrl,
        collectionTypes: Array.isArray(collectionTypes)
          ? collectionTypes
          : (collectionTypes?.split(',').map((s: string) => s.trim()) ?? []),
        nextAvailable:
          nextAvailable?.length > 0 ? new Date(nextAvailable[0].date) : null,
      },
      create: {
        id: uuidv4(),
        labId: lab.id,
        //labName is not used in labDetails, but can be stored in lab table if needed
        testType,
        experienceYears: experienceYears ? parseInt(experienceYears) : null,
        imageUrl,
        collectionTypes: Array.isArray(collectionTypes)
          ? collectionTypes
          : (collectionTypes?.split(',').map((s: string) => s.trim()) ?? []),
        nextAvailable:
          nextAvailable?.length > 0 ? new Date(nextAvailable[0].date) : null,
      },
    });

    // 3️⃣ Create TimeSlots (if any)
    if (nextAvailable && nextAvailable.length > 0) {
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
      JSON.stringify({ message: 'Lab created successfully' }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
