import prisma from "../lib/prisma";


export default async function getAllDoctors(){
   try{
    const doctors = await prisma.user.findMany({
        where:{role:"DOCTOR"} , 
        include:{

            doctor:{
                include:{
                    department:true
                }
             }, 
                        } 
          })
          console.log(doctors);
          if(!doctors){
            throw new Error("doctors data couldnt be retrived");
          }
          return doctors;
     }
     catch(err:any){
        throw new Error(err.message)
     }
    
    
}