import prisma from "../lib/prisma";
import { Gender } from "@prisma/client";
type editProfile = {
  name: string
  email: string
  phone: string
  age: number
  gender?: Gender
  img :string,
  bloodtype :string,
  allergies:string,
  recordTitle : string, 
  recordUrl: string[]


}

export async function editPatientProfile(profileData:editProfile){
    try{
        const exist = await prisma.user.findUnique({where:{
            email:profileData.email
        }})
        if(!exist){
            throw new Error("User doesnt exist");
        }
        const newUser = await prisma.user.update({
            where:{email:exist.email},
            data:{
                name :profileData.name,
                phone:profileData.phone,
                age:profileData.age,
                gender:profileData.gender
            }
        })
        const patient = await prisma.patient.findUnique({where:{userId :exist.id}
        })
        if(!patient){
            throw new Error("patient profile not found")
        }
        const newPatient = await prisma.patient.update({
            where:{userId :exist.id},
            data:{img :profileData.img , 
                bloodtype : profileData.bloodtype, 
                allergies : profileData.allergies,  
            }
        })
        const medicalRecord = await prisma.medicalRecord.findFirst({
            where:{patientId : patient?.id}
        })
        if(!medicalRecord){
            throw new Error("medical record not found")
        }
        const newPatientRecord = await prisma.medicalRecord.update({
            where:{id : medicalRecord.id},
            data:{
                title: profileData.recordTitle,
                fileUrl: profileData.recordUrl
            }
        })
     return true
    }
    catch(err:any){
        throw new Error(err.message);
    }

}
