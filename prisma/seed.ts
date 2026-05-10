import 'dotenv/config'; 
import { PrismaClient } from '@prisma/client';
 import { PrismaPg } from '@prisma/adapter-pg'; 
 import bcrypt from "bcrypt" 
const adapter = new PrismaPg({ connectionString:process.env.DATABASE_URL }) 
const prisma = new PrismaClient( {adapter, } );

async function main() {
  console.log("🌱 Seeding started...");

  // ─────────────────────────────────────────────
  // DEPARTMENTS
  // ─────────────────────────────────────────────
  await prisma.department.createMany({
    data: [
      { name: 'SURGERY' },
      { name: 'EMERGENCY' },
    ],
    skipDuplicates: true,
  });

  const surgeryDept = await prisma.department.findUnique({
    where: { name: 'SURGERY' },
  });

  const emergencyDept = await prisma.department.findUnique({
    where: { name: 'EMERGENCY' },
  });

  if (!surgeryDept || !emergencyDept) {
    throw new Error("Departments not found after seeding");
  }

  // ─────────────────────────────────────────────
  // ROOMS
  // ─────────────────────────────────────────────
  const surgeryRooms = Array.from({ length: 20 }, (_, i) => ({
    name: `OR-${String(i + 1).padStart(2, '0')}`,
    type: "SURGERY" as const,
    
    departmentId: surgeryDept.id,
  }));

  const emergencyRooms = Array.from({ length: 10 }, (_, i) => ({
    name: `ER-${String(i + 1).padStart(2, '0')}`,
    type: "EMERGENCY" as const,
    departmentId: emergencyDept.id,
  }));

  await prisma.room.createMany({
    data: [...surgeryRooms, ...emergencyRooms],
    skipDuplicates: true,
  });

  console.log("✓ Rooms seeded");

  // ─────────────────────────────────────────────
  // ADMIN USER
  // ─────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("1234", 10);

  await prisma.user.upsert({
    where: { email: "amgadshaapan@gmail.com" },
    update: {},
    create: {
      name: "amgad",
      email: "amgadshaapan@gmail.com",
      password: passwordHash,
      phone: "123456789",
      role: "ADMIN",
      gender: "MALE",
      age: 21,
    },
  });

  console.log("✓ Admin user seeded");

  console.log("🎉 Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });