// app/api/lab/[id]/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = (await params).id;
    console.log(id);
    const lab = await db.lab.findUnique({
      where: { id: id },
      include: {
        details: true,
        timeSlots: {
          include: { exceptions: true },
        },
      },
    });

    if (!lab) return Response.json({ error: 'Lab not found' }, { status: 404 });

    const d = lab.details;

    // Group slots into Morning/Afternoon/Evening, filtering exceptions
    const groupedSlots = {
      Morning: [],
      Afternoon: [],
      Evening: [] as string[],
    };
    lab.timeSlots.forEach((slot) => {
      if (!slot.isActive) return;
      const disabledToday = slot.exceptions.some((e) => e.isUnavailable);
      if (disabledToday) return;

      const key = slot.session.charAt(0) + slot.session.slice(1).toLowerCase(); // MORNING -> Morning
      if (groupedSlots[key as keyof typeof groupedSlots]) {
        groupedSlots[key as keyof typeof groupedSlots].push(slot.time);
      }
    });

    const dto = {
      id: lab.id,
      name: d?.labName,
      testType: d?.testType,
      location: lab.labLocation,
      nextAvailable: d?.nextAvailable,
      rating: d?.rating,
      isAvailable: d?.isAvailable,
      image: d?.imageUrl,
      collectionTypes: d?.collectionTypes,
      latitude: d?.latitude,
      longitude: d?.longitude,
      timeSlots: groupedSlots,
    };

    return Response.json(dto);
  } catch (e) {
    console.error('Error fetching lab details:', e);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
