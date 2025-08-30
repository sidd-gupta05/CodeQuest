import { db } from '@/lib/prisma';

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
