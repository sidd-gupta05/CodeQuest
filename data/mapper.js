// interface LabUI {
//   id: number;
//   name: string;
//   testType: string;
//   location: string;
//   nextAvailable: string;
//   rating: number;
//   votes: number;
//   totalVotes: number;
//   experience: number;
//   isAvailable: boolean;
//   isLoved: boolean;
//   image: string;
//   collectionTypes: string[];
//   timeSlots: {
//     Morning: string[];
//     Afternoon: string[];
//     Evening: string[];
//   };
// }

export function mapLabs(rawLabs) {
  return rawLabs.map((lab, index) => {
    const details = lab.details || {};

    return {
      id: index + 1,
      name: `Lab #${index + 1}`, // You can replace with actual lab name if stored
      testType: details.testType || "General Tests",
      location: lab.labLocation || "Unknown Location",
      nextAvailable: details.nextAvailable
        ? new Date(details.nextAvailable).toISOString().split("T")[0]
        : "N/A",
      rating: details.rating ?? 0,
      votes: 0, // You can calculate if you store votes in DB
      totalVotes: 0,
      experience: details.experienceYears ?? 0,
      isAvailable: true, // or derive from your business logic
      isLoved: details.isLoved ?? false,
      image:
        details.imageUrl ||
        "https://placehold.co/100x100/E8F7F7/333333?text=LAB",
      collectionTypes: details.collectionTypes?.length
        ? details.collectionTypes
        : ["Home Collection", "Visiting to Lab"],
      timeSlots: groupTimeSlots(lab.timeSlots || []),
    };
  });
}

function groupTimeSlots(slots) {
  const groups = { Morning: [], Afternoon: [], Evening: [] };

  slots.forEach((slot) => {
    const hour = parseInt(slot.time.split(":")[0], 10);
    if (hour < 12) {
      groups.Morning.push(slot.time);
    } else if (hour < 17) {
      groups.Afternoon.push(slot.time);
    } else {
      groups.Evening.push(slot.time);
    }
  });

  // Ensure exactly 4 time slots per period
  for (const key in groups) {
    while (groups[key].length < 4) {
      groups[key].push("-");
    }
  }

  return groups;
}
