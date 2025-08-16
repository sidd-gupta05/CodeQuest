import fs from 'fs';
import 'dotenv/config'; // so process.env works
import { mapLabs } from './mapper.js';

export async function fetchLabDetailsAndSave() {
  try {
    const res = await fetch('http://localhost:3000/api/labs', {
      method: 'GET',
      headers: {
        'x-service-key': process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch lab details: ${res.status} ${res.statusText}`
      );
    }

const data = await res.json();        // 1️⃣ raw DB format
const labsForUI = mapLabs(data);      // 2️⃣ transform into UI format
fs.writeFileSync(                     // 3️⃣ save as pretty JSON
  'lab-details.json',
  JSON.stringify(labsForUI, null, 2),
  'utf-8'
);


    console.log('✅ Lab details saved to lab-details.json');
  } catch (err) {
    console.error('❌ Error fetching lab details:', err);
  }
}

// Run if standalone
fetchLabDetailsAndSave();
