import prisma from "../lib/prisma";

export default async function fetch_service() {
    try {
        const emergency = await prisma.emergencyQueue.findMany();
        const surgeryies = await prisma.surgery.findMany();
        const availableDoctors = await prisma.doctor.findMany({
          include:{
            availability:{
                where:{isActive:true}
            }
          }
        });
        return { emergency, surgeryies, availableDoctors };
        
    } catch (error) {
        console.error("Error fetching services:", error);
        throw error;
    }
}