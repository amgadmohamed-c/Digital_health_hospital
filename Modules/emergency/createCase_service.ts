import prisma from "../lib/prisma";
import { Priority } from "@prisma/client";
import { QueueStatus } from "@prisma/client";
import { saveUser } from "../Auth/signUp_Controller";
import { Gender } from "@prisma/client";
import newPatientProfile from "../patientProfile/editPatientProfile_controller";
type caseData = {
    name? :string , 
    password ?:string , 
    email? :string ,
    doctorId : string , 
    department  : string , 
    priority : string ,  
    phone ? : string
    age ? : number,
    ssn ?  : string
    gender?: Gender

}



export async function isStaff(email : string ){
    try{
        const staff = await prisma.user.findUnique({where:{email :email} , 
        include : {doctor:true   , 
            nurse : true ,

        }})
        if(!staff){
            throw new Error("user is not staff"); 
        }
        return staff ;

    }
    catch(err:any){
        console.log(err.message);
        throw new Error(err.message);
    }
}
const mapPriority = (value: string): Priority => {
  const normalized = value.toUpperCase();

  if (!(normalized in Priority)) {
    throw new Error("Invalid priority value");
  }

  return Priority[normalized as keyof typeof Priority];
};

export default async function  createEmergencyCase(data:caseData) {
    const priority = mapPriority(data.priority);
    try{ 
        const department = await prisma.department.findUnique({
            where:{name : data.department }
        })
        if(!department ){
            throw new Error("department not found"); 
        }
        const user = await prisma.user.findUnique({
            where:{email : data.email },
            include : {patient : true }
        })
        let patientData  = user?.patient ; 
        if(!user){
            const newData = {
                name : data.name! , 
                password : data.password! , 
                email : data.email! , 
                phone : data.phone! , 
                age  :data.age! ,
                ssn : data.ssn! , 
                gender : data.gender , 
            }
         patientData = await saveUser(newData);

        }
        
        const newCase = await prisma.emergencyQueue.create({
            data : {patientId : user?.patient?.id || patientData?.id! , 
                doctorId : data.doctorId! , 
                departmentId : department.id , 
                status : "WAITING" , 
                priority : priority
            }
        
            
        })
        if(!newCase ){
            throw new Error("coulnd create case"); 
        }
        return newCase ; 

    }catch(err:any){
        console.log(err.message ); 
        throw new Error(err.message);
    }

    
}