import prisma from "../lib/prisma";

export default async function getDoctorWorkLoad(doctorId:string){
    const doctor = await prisma.user.findUnique({
        where:{
            id:doctorId,
            role:"DOCTOR"
        },
        include:{
            doctor:{
                include:{
                    appointments:true , 
                    surgeries:true
                }
            }, 
            

        }
    })
    if(!doctor){
        throw new Error("doctor not found")
    }
    return doctor ; 
}