import prisma from "../lib/prisma";

export default async function DoctorAppointmentService(email : string){

    if(!email){
        throw new Error("doctorId is null");
    }
    try{
        const dr = await prisma.user.findUnique({
            where:{email : email},
            include:{
                doctor:true
            }
        })
        const drId = dr?.doctor?.id ; 
        const myappointments = await prisma.appointment.findMany({
            where:{doctorId:drId}
            ,include:{
                patient:{
                    include:{user:true}
                }
            }
        })

        if(!myappointments){
            throw new Error("faild to fetch appointments");
        }

    return myappointments;
    }
    catch(err:any){
        throw new Error(err.message);

    }
}