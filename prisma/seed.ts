import { PrismaClient } from '../lib/generated/prisma'; // Explicit import
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Starting seeding process...');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.labTimeSlot.deleteMany();
    await prisma.labDetails.deleteMany();
    await prisma.lab.deleteMany();
    await prisma.user.deleteMany();

    // Seed Users and Labs
    console.log('Seeding lab users...');
    const labUsers = await Promise.all(
      Array.from({ length: 5 }).map(async () => {
        const userData = {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          phone: faker.phone.number(),
          role: 'LAB',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        console.log('Creating lab user:', userData);
        const user = await prisma.user.create({ data: userData });

        const labData = {
          userId: user.id,
          labLocation: faker.location.streetAddress(),
          nablCertificateNumber: faker.string.alphanumeric(10),
          certificateUrl: faker.internet.url(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        console.log('Creating lab:', labData);
        const lab = await prisma.lab.create({ data: labData });

        const labDetailsData = {
          labId: lab.id,
          labName: faker.company.name(),
          collectionTypes: ['Blood', 'Urine', 'Saliva', 'CBC', 'MRI'],
          experienceYears: faker.number.int({ min: 1, max: 20 }),
          imageUrl: faker.image.url(),
          isLoved: faker.datatype.boolean(),
          latitude: parseFloat(faker.location.latitude().toFixed(6)),
          longitude: parseFloat(faker.location.longitude().toFixed(6)),
          nextAvailable: faker.date.soon(),
          isAvailable: true,
          rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
          testType: faker.helpers.arrayElement(['Pathology', 'Radiology', 'Urine Tests']),
        };
        console.log('Creating lab details:', labDetailsData);
        const labDetails = await prisma.labDetails.create({ data: labDetailsData });

        const timeSlots = [
          { time: '09:00', session: 'MORNING' },
          { time: '12:00', session: 'MORNING' },
          { time: '15:00', session: 'AFTERNOON' },
          { time: '18:00', session: 'EVENING' },
        ];
        console.log('Creating time slots for lab:', lab.id);
        await prisma.labTimeSlot.createMany({
          data: timeSlots.map((slot) => ({
            labId: lab.id,
            time: slot.time,
            session: slot.session,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        });

        return { user, lab, labDetails };
      })
    );

    // Seed Patients (optional)
    console.log('Seeding patient users...');
    const patientUsers = await Promise.all(
      Array.from({ length: 5 }).map(async () => {
        const userData = {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          phone: faker.phone.number(),
          role: 'PATIENT',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        console.log('Creating patient user:', userData);
        const user = await prisma.user.create({ data: userData });

        const patientData = {
          userId: user.id,
          address: faker.location.streetAddress(),
          dateOfBirth: faker.date.birthdate(),
          gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),
          latitude: parseFloat(faker.location.latitude().toFixed(6)),
          longitude: parseFloat(faker.location.longitude().toFixed(6)),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        console.log('Creating patient:', patientData);
        const patient = await prisma.patient.create({ data: patientData });

        return { user, patient };
      })
    );

    console.log('Seeding completed:', { labUsers, patientUsers });
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    console.log('Prisma client disconnected');
  }
}

seed();