import prisma from "../lib/prisma";

export default async function DeleteUser(id: string) {
    try {
        // Delete related records first (in a transaction to be safe)
        const deletedUser = await prisma.$transaction(async (prisma) => {
            // Delete doctor if exists
            await prisma.doctor.deleteMany({ where: { userId: id } });
            
            // Delete patient if exists  
            await prisma.patient.deleteMany({ where: { userId: id } });
            
            // Delete nurse if exists
            await prisma.nurse.deleteMany({ where: { userId: id } });
            
            // Now delete the user
            return await prisma.user.delete({
                where: { id: id }
            });
        });
        
        return deletedUser;
        
    } catch (err: any) {
        throw new Error(err.message);
    }
}