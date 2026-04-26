import { AppointmentStatus, AppointmentType } from "../../generated/prisma";
import prisma from "../lib/prisma";

type appointmentDataType = {
    email  : string ,
    doctorId : string ,
    appointmentType : AppointmentType ,
    schuledAt : Date , 
    appointmentStatus: AppointmentStatus ,
    duration : number ,

}
export default async function saveAppointment(appointmentData :appointmentDataType){
    try{
        const user = await prisma.user.findUnique({
            where:{email : appointmentData.email}, 
            include:{
                patient : true
            }
        })

        if(!user || !user.patient){
            throw new Error("user not found"); 
        }
        const department = await prisma.department.findUnique({
            where:{
                name:"SURGERY"
            }
        })
        if(!department){
            throw new Error("department doesnt exist");
        }
        const endsAt = new Date(appointmentData.schuledAt.getTime() + appointmentData.duration * 60000);   
        const newAppointment= await prisma.appointment.create({
            data:{
                patientId : user?.patient?.id , 
                doctorId : appointmentData.doctorId , 
                scheduledAt : appointmentData.schuledAt , 
                status :appointmentData.appointmentStatus , 
                type:appointmentData.appointmentType,
                ...(appointmentData.duration && {durationMinutes : appointmentData.duration}) , 
                departmentId:department.id,
                endsAt : endsAt
                
            }
        })
        if(!newAppointment){
            throw new Error("couldnt create appointment");
        }
        return newAppointment
    }
    catch(err:any){
        console.log(err.message);
        throw new Error(err.message);
    }
    
}