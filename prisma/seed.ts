import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
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
}

main()
  .then(() => console.log('Seeding done'))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());