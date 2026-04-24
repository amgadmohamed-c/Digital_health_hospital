import prisma from "../lib/prisma";
import { Priority, SurgeryStatus, SurgeryType } from "../../generated/prisma";

type surgeryDataType ={
  patientId : string,
  surgeonId : string,
  roomId    : string,
  emergencyQueueId? : string 
  type      :  SurgeryType , 
  surgeryStatus : SurgeryStatus , 
  priority ? :  Priority,
  notes  ?   : string,
  scheduledAt : Date , 
  estimatedDuration ? : number , 
  startedAt :   Date ,
  endedAt   : Date ,




} 


export default async function saveSurgery(surgeryData:surgeryDataType) {
    try{
        const surgery = await prisma.surgery.create({
            data:{
                surgeonId : surgeryData.surgeonId ,
                patientId : surgeryData.patientId ,
                roomId : surgeryData.roomId , 
                ...(surgeryData.emergencyQueueId && {emergencyQueueId:surgeryData.emergencyQueueId}),
                type : surgeryData.type,
                status : surgeryData.surgeryStatus ,
                ...(surgeryData.priority && {priority : surgeryData.priority})
            }
        })
        if(!surgery){
            throw new Error("surgery creation faild") // to do today 
        }
    }
    catch(err:any){

    }
    
}