// pages/api/labs.ts
import { db } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const labs = await db.labs.findMany({
      include: {
        appointments: {
          orderBy: { date: "asc" },
          take: 1, // Get next available
        },
      },
    });

    const formatted = labs.map(lab => ({
      id: lab.id,
      name: lab.labName ?? "Unknown Lab",
      testType: lab.testType ?? "",
      location: lab.labAddress,
      nextAvailable: lab.appointments[0]?.date?.toISOString().split("T")[0] ?? "Not Available",
      rating: lab.rating ?? 0,
      experience: lab.experienceYears ?? 0,
      isLoved: lab.isLoved ?? false,
      image: lab.imageUrl ?? "",
      collectionTypes: lab.collectionTypes ?? [],
    }));

    res.status(200).json(formatted);
  } catch (error: any) {
    console.error("Error fetching labs:", error);
    res.status(500).json({ error: "Failed to fetch labs" });
  }
}
