import cron from 'node-cron';
import prisma from '../Modules/lib/prisma';

cron.schedule("*/15 * * * *" ,  async () =>{
    const now = new Date();
    const data = await prisma.appointment.updateMany({
        where:{
            status:"SCHEDULED",
            scheduledAt:{
                lte: now
            },
            endsAt: { gte: now }

            },
        data:{
            status:"ACTIVE"
        }
    })

     await prisma.appointment.updateMany({
    where: {
      status: "ACTIVE",
      endsAt: { lte: now }
    },
    data: { status: "COMPLETED" }
  });
  
});
