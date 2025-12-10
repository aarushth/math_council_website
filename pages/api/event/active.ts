import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const activeEvents = await prisma.event.findMany({
      where: { active: true },
    });
    const serialized = activeEvents.map(event => ({
      ...event,
      date: event.date.toISOString(),
    }));

    return res.status(200).json(serialized);
  } catch (error) {
    console.error("Error fetching active events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
}
