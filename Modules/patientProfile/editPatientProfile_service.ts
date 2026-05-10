import prisma from "../lib/prisma";
import { Gender } from "@prisma/client";

type editProfile = {
  name?: string;
  email: string;
  phone?: string;
  age?: number;
  gender?: Gender;
  img?: string;
  bloodtype?: string;
  allergies?: string;
  recordTitle?: string;
  recordUrl?: string[];
};

export async function editPatientProfile(profileData: editProfile) {
  try {
    const exist = await prisma.user.findUnique({
      where: { email: profileData.email },
    });
    if (!exist) throw new Error("User doesn't exist");

    // Update user fields
    await prisma.user.update({
      where: { email: exist.email },
      data: {
        ...(profileData.name   && { name:  profileData.name  }),
        ...(profileData.phone  && { phone: profileData.phone }),
        ...(profileData.age    && { age:   profileData.age   }),
        ...(profileData.gender && { gender: profileData.gender }),
      },
    });

    const patient = await prisma.patient.findUnique({
      where: { userId: exist.id },
    });
    if (!patient) throw new Error("Patient profile not found");

    // FIX 1: each field was mapped to "img" — they now map to their correct columns
    await prisma.patient.update({
      where: { userId: exist.id },
      data: {
        ...(profileData.img       && { img:       profileData.img       }),
        ...(profileData.allergies && { allergies: profileData.allergies }),
        ...(profileData.bloodtype && { bloodtype: profileData.bloodtype }),
      },
    });

    // FIX 2: only touch medical records if a recordTitle + recordUrl were actually sent
    if (profileData.recordTitle && profileData.recordUrl?.length) {
      // FIX 3: create a NEW record instead of overwriting the first existing one
      // (overwriting would destroy the patient's previous records every time they upload)
      await prisma.medicalRecord.create({
        data: {
          patientId: patient.id,
          title:     profileData.recordTitle,
          fileUrl:   profileData.recordUrl,
        },
      });
    }

    return true;
  } catch (err: any) {
    throw new Error(err.message);
  }
}