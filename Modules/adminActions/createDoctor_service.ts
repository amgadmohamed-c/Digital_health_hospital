import prisma from "../lib/prisma";
import type { Role , Gender} from "@prisma/client";
import bcrypt from "bcrypt";


type doctor = {
    name : string , 
    email:string , 
    password :string , 
    Dep : string , 
    specialization : string ,
    phone:string,
    age:number,
    gender:Gender,


}
export async function isAdmin(email:string){
    try{
        const admin = await prisma.user.findUnique(
            {
                where:{
                    email:email , 
                    role:"ADMIN"
                }

            }
        )
        if(!admin){
            throw new Error("user is not an admin ");
        }
        return true
    }
    catch(Err:any){
        throw new Error(Err.message || "user is not admin")
    }

}

export default  async function createDoctor(doctorData:doctor){
    try{
      const exists = await prisma.user.findUnique({
        where:{
            email:doctorData.email
        }
      })
      if(exists){
        throw new Error("user already exists ")
      }
      const department = await prisma.department.findUnique({
        where:{
            name:doctorData.Dep
        }
      }) 
          if(!department){
        throw new Error("department doesnt exist")
      } 
      const newDoctor = await prisma.user.create({
        data:{
            name : doctorData.name,
            email:doctorData.email,
            password:(await bcrypt.hash(doctorData.password,10)).toString(),
            phone:doctorData.phone,
            role:"DOCTOR",
            gender:doctorData.gender,
            age:doctorData.age
        }
      })
  
      const doctor =await prisma.doctor.create({
        data:{
            specialization:doctorData.specialization,
            userId:newDoctor.id,
            departmentId:department.id
        }
      })
      if(!doctor){
        throw new Error("doctor not created");
      }
      return doctor; 

    }catch(error:any){
        throw new Error(error.message || "couldnt create doctor")
    }
}