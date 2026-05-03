import prisma from "../lib/prisma";
import { Priority, Gender } from "@prisma/client";
import { saveUser } from "../Auth/signUp_Controller";

type CaseData = {
  // Existing patient
  email?: string;
  // New patient fields
  name?: string;
  password?: string;
  phone?: string;
  age?: number;
  ssn?: string;
  gender?: Gender;
  // Case fields
  doctorId?: string;
  department: string;
  priority: string;
};

const mapPriority = (value: string): Priority => {
  const normalized = value.toUpperCase();
  if (!(normalized in Priority)) {
    throw new Error("Invalid priority value");
  }
  return Priority[normalized as keyof typeof Priority];
};

export async function isStaff(email: string) {
  const staff = await prisma.user.findUnique({
    where: { email },
    include: { doctor: true, nurse: true }
  });

  return staff; // null if not found — let controller decide
}

export default async function createEmergencyCase(data: CaseData) {
  const priority = mapPriority(data.priority);

  const department = await prisma.department.findUnique({
    where: { name: data.department }
  });
  if (!department) throw new Error("Department not found");

  let patientId: string;

  if (data.email) {
    // Check if patient already exists
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { patient: true }
    });

    if (user?.patient) {
      // Existing patient
      patientId = user.patient.id;
    } else {
      // Email provided but no account — create one
      const patient = await saveUser({
        name: data.name!,
        password: data.password!,
        email: data.email,
        phone: data.phone!,
        age: data.age!,
        ssn: data.ssn!,
        gender: data.gender
      });
      patientId = patient.id;
    }
  } else {
    // Walk-in — no email provided
    if (!data.ssn) throw new Error("SSN is required for walk-in patients");

    const patient = await saveUser({
      name: data.name ?? "Walk-in Patient",
      password: "0000",
      email: `${data.ssn}@hospital.internal`,
      phone: data.phone ?? "0000000000",
      age: data.age ?? 0,
      ssn: data.ssn,
      gender: data.gender
    });
    patientId = patient.id;
  }

  const newCase = await prisma.emergencyQueue.create({
    data: {
      patientId,
      doctorId: data.doctorId ?? null,
      departmentId: department.id,
      status: "WAITING",
      priority
    }
  });

  return newCase;
}