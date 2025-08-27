import { PrismaClient } from "@prisma/client";
import { labsData } from './data' // make sure data.js exports labsData

const db = new PrismaClient();

async function main() {
  for (const lab of labsData) {
    // Create user for the lab
    const user = await db.user.create({
      data: {
        email: `lab${lab.id}@example.com`,
        firstName: lab.name,
        lastName: '',
        phone: `999000${String(lab.id).padStart(2, '0')}`,
        role: 'LAB',
      },
    });

    // Create lab entry with relations
    const newLab = await db.lab.create({
      data: {
        userId: user.id,
        labLocation: lab.location,
        nablCertificateNumber: `NABL${lab.id}`,
        certificateUrl: `https://example.com/cert${lab.id}.pdf`,
        details: {
          create: {
            labName: lab.name,
            testType: lab.testType,
            collectionTypes: lab.collectionTypes,
            experienceYears: lab.experience,
            imageUrl: lab.image,
            isLoved: lab.isLoved,
            rating: lab.rating,
            nextAvailable:
              lab.nextAvailable === 'Not Available'
                ? null
                : new Date(lab.nextAvailable),
            latitude: 12.97 + Math.random(),
            longitude: 77.59 + Math.random(),
          },
        },
        timeSlots: {
          create: Object.entries(lab.timeSlots).flatMap(([session, slots]) =>
            slots
              .filter((time) => time !== '-') // skip unavailable
              .map((time) => ({
                time,
                session: session.toUpperCase(), // "MORNING"/"AFTERNOON"/"EVENING"
              }))
          ),
        },
      },
    });

    console.log(`Seeded lab: ${lab.name} (${newLab.id})`);
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
