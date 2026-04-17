import prisma from "../lib/prisma";


export default async function getAllPatients(){
   try{
    const patients = await prisma.user.findMany({
        where:{role:"PATIENT"} , 
        include:{
            patient:true
                } 
          })
          if(!patients){
            throw new Error("patient data couldnt be retrived");
          }
          return patients;
     }
     catch(err:any){
        throw new Error(err.message)
     }
    
    
}