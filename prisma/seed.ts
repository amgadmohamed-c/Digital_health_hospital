import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from "bcrypt"
const adapter = new PrismaPg({
    connectionString:process.env.DATABASE_URL
})

const prisma = new PrismaClient(
    {adapter,
        
    }
); // <-- just this, no datasources

async function main() {
  await prisma.department.createMany({
    data: [
      { name: 'SURGERY' },
      { name: 'EMERGENCY' },
    ],
    skipDuplicates: true,
  });
  const amgadPass = 1234
  await prisma.user.create({
    data:{            
    name : "amgad",
    email:"amgadshaapan@gmail.com",
    password:(await bcrypt.hash(amgadPass.toString(),10)).toString(),
    phone:"123456789",
    role:"ADMIN",
    gender:"MALE",
    age:21}
  })
}

main()
  .then(() => console.log('Seeding done'))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());