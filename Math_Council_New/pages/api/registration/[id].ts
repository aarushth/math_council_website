import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/prisma/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const registrationId = Number(id);

  if (!registrationId || isNaN(registrationId)) {
    return res.status(400).json({ message: "Invalid registration ID" });
  }

  try {
    switch (req.method) {
      case "DELETE":
        // Delete registration
        const deletedRegistration = await prisma.registration.delete({
          where: { id: registrationId },
        });
        return res.status(200).json({
          success: true,
          registration: deletedRegistration,
        });

      case "PUT":
        // Update registration
        const { studentName, grade } = req.body;

        if (!studentName || grade === undefined) {
          return res
            .status(400)
            .json({ message: "studentName and grade are required" });
        }

        // Update only studentName and grade
        const updatedRegistration = await prisma.registration.update({
          where: { id: registrationId },
          data: {
            studentName,
            grade: Number(grade),
          },
        });

        return res.status(200).json({
          success: true,
          registration: updatedRegistration,
        });

      default:
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error handling registration:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}
