import 'dotenv/config'; 
import  {PrismaClient} from "../generated/prisma";
import { PrismaPg } from '@prisma/adapter-pg'; 
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─── Device templates per surgery room ───────────────────────────────────────
const DEVICE_TEMPLATES: Array<{ name: string; type: string }> = [
  { name: "Anesthesia Machine",         type: "Anesthesia" },
  { name: "Ventilator",                 type: "Respiratory" },
  { name: "Patient Monitor",            type: "Monitoring" },
  { name: "Electrosurgical Unit (ESU)", type: "Surgical" },
  { name: "Surgical Light (Primary)",   type: "Lighting" },
  { name: "Surgical Light (Secondary)", type: "Lighting" },
  { name: "Suction Machine",            type: "Suction" },
  { name: "Infusion Pump",              type: "Infusion" },
  { name: "Pulse Oximeter",             type: "Monitoring" },
  { name: "Defibrillator",              type: "Cardiac" },
  { name: "Laparoscopy Tower",          type: "Endoscopy" },
  { name: "C-Arm Fluoroscope",          type: "Imaging" },
];

type DeviceStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "OUT_OF_SERVICE";

function randomStatus(index: number): DeviceStatus {
  const roll = index % 10;
  if (roll <= 6) return "AVAILABLE";
  if (roll <= 8) return "IN_USE";
  if (roll === 9) return "MAINTENANCE";
  return "OUT_OF_SERVICE";
}

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
  // MEDICAL DEVICES
  // ─────────────────────────────────────────────
  const seededSurgeryRooms = await prisma.room.findMany({
    where: { departmentId: surgeryDept.id },
  });

  let globalIndex = 0;
  const deviceRows = seededSurgeryRooms.flatMap(room =>
    DEVICE_TEMPLATES.map(template => ({
      name:     template.name,
      type:     template.type,
      roomId:   room.id,
      status:   randomStatus(globalIndex++),
      serialNo: `SN-${room.name}-${template.type.slice(0, 3).toUpperCase()}-${String(globalIndex).padStart(4, '0')}`,
    }))
  );

  await prisma.medicalDevice.createMany({
    data: deviceRows,
    skipDuplicates: false,
  });

  console.log(
    `✓ Medical devices seeded — ${deviceRows.length} devices across ${seededSurgeryRooms.length} surgery rooms`
  );

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