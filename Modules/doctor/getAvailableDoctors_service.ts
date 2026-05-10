import prisma from "../lib/prisma";
export default async function getAvailableDoctors(department?: string) {
    try {

        const departmentFilter =  await prisma.department.findUnique({
            where: { name: department }
          
        });
        if(!departmentFilter){
            throw new Error("Department not found");
        }

        const doctors = await prisma.doctor.findMany({
            where:{
                ...(department && { departmentId: departmentFilter.id }),
            } , 
        
            include: {
                user: true, 
                availability:{
                    where: {isActive: true}
                } // Include department details
            },
        });     
        return doctors;
    }
    catch(err :any ){
        throw new Error(err.message); 
    }
}