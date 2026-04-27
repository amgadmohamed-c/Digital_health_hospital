import prisma from "../lib/prisma";
import { Priority, SurgeryStatus, SurgeryType } from "../../generated/prisma";

type surgeryDataType ={
  patientId : string,
  surgeonId : string,
  roomId    : string,
  emergencyQueueId? : string 
  type      :  SurgeryType , 
  priority ? :  Priority,
  notes  ?   : string,
  scheduledAt : Date , 
  estimatedDuration  : number , 
  startedAt :   Date ,
  





} 


export default async function saveSurgery(surgeryData:surgeryDataType) {
    try{
        const endedAt = new Date(surgeryData.startedAt.getTime()+ surgeryData.estimatedDuration * 60000);
        
        const surgery = await prisma.surgery.create({
            data:{
                surgeonId : surgeryData.surgeonId ,
                patientId : surgeryData.patientId ,
                roomId : surgeryData.roomId , 
                ...(surgeryData.emergencyQueueId && {emergencyQueueId:surgeryData.emergencyQueueId}),
                type : surgeryData.type,
                surgeryStatus : "PENDING" ,
                ...(surgeryData.priority && {priority : surgeryData.priority}),
                requestedBy : surgeryData.surgeonId,
                scheduledAt : surgeryData.scheduledAt , 
                startedAt   : surgeryData.startedAt , 
                endedAt     : endedAt,
                // ✅ Fix — add these to the data object
                ...(surgeryData.notes && { notes: surgeryData.notes }),
                ...(surgeryData.estimatedDuration && { estimatedDuration: surgeryData.estimatedDuration }),
            }
        })
        if(!surgery){
            throw new Error("surgery creation faild") // to do today 
        }
        return surgery  ; 
    }
    catch(err:any){
        console.log(err.message);
        throw new Error(err.message);

    }
    
}