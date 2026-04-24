import { AppointmentStatus } from "../../generated/prisma";
import prisma from "../lib/prisma";
type editData = {
    appointmentId : string , 
    appointmentStatus: AppointmentStatus
}


export default async function cancelAppointment(cancelData : editData) {
    try{
        const deleted = await prisma.appointment.update({
            where:{
                id:cancelData.appointmentId
            }
            ,
            data:{
                status : cancelData.appointmentStatus
            }
        })
        if(!deleted){
            throw new Error("couldnt delete appointment");
        }
        return deleted ;
    }
    catch(err:any){
        throw new Error(err.message);

    }
    
}