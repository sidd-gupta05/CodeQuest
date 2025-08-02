// scripts/fetchLabsData.js
import fs from 'fs';

async function fetchLabsData() {
  console.log('Fetching labs data...');

  const res = await fetch('http://localhost:3000/api/labs', {
    headers: {
      'x-service-key': process.env.SUPABASE_SERVICE_ROLE_KEY, // secret key
    },
  });

  if (!res.ok) {
    console.error(`❌ Failed to fetch labs: ${res.status} ${res.statusText}`);
    const errText = await res.text();
    console.error('Response:', errText);
    return;
  }

  const labs = await res.json();

  const labsData = labs.map(lab => ({
    id: lab.id,
    name: lab.name,
    testType: lab.details?.testType || 'Unknown Test',
    location: lab.details?.location || 'Unknown Location',
    nextAvailable: lab.details?.nextAvailable
      ? new Date(lab.details.nextAvailable).toISOString().split('T')[0]
      : null,
    rating: 4.9,
    experience: lab.details?.experienceYears || 0,
    isLoved: lab.details?.isLoved || false,
    image: lab.details?.imageUrl || 'https://placehold.co/100x100/E8F7F7/333333?text=Lab',
    collectionTypes: lab.details?.collectionTypes || [],
    timeSlots: groupTimeSlots(lab.timeSlots || []),
  }));

  fs.writeFileSync(
    './Data.js',
    `export const labsData = ${JSON.stringify(labsData, null, 2)};`
  );

  console.log('✅ Data.js created successfully!');
}

function groupTimeSlots(timeSlots) {
  const grouped = { Morning: [], Afternoon: [], Evening: [] };

  timeSlots.forEach(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    if (hour < 12) grouped.Morning.push(slot.time);
    else if (hour < 17) grouped.Afternoon.push(slot.time);
    else grouped.Evening.push(slot.time);
  });

  Object.keys(grouped).forEach(period => {
    while (grouped[period].length < 4) grouped[period].push('-');
  });

  return grouped;
}

// Run script
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchLabsData().catch(console.error);
}
