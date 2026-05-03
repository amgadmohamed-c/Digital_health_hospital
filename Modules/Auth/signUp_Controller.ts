import 'dotenv/config'
import prisma from '../lib/prisma';
import type { Gender } from '@prisma/client'
import bcrypt from "bcrypt";

type CreateUserInput = {
  name: string
  email: string
  password: string
  phone: string
  age: number
  ssn: string
  gender?: Gender
}

export async function saveUser(user: CreateUserInput) {
  const exist = await prisma.user.findUnique({ where: { email: user.email } });
  if (exist) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password: hashedPassword,
      phone: user.phone,
      age: user.age,
      gender: user.gender,
      ssn: user.ssn
    }
  });

  const patient = await prisma.patient.create({
    data: { userId: newUser.id }
  });

  await prisma.medicalRecord.create({
    data: {
      patientId: patient.id,
      title: "Initial Record",
      fileUrl: []
    }
  });

  return patient;
}