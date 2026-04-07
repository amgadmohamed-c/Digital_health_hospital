import prisma from "../lib/prisma";
import { Gender } from "@prisma/client";
import bcrypt from "bcrypt";
import { errorMonitor } from "node:events";
type nurse = {
        name : string , 
        email:string , 
        password :string , 
        Dep : string , 
        phone:string,
        age:number,
        gender:Gender,
}

export async function createNurse(newNurse :nurse){
    try{
        const department= await prisma.department.findUnique({
            where:{
                name : newNurse.Dep
            }
        })
        if(!department){
            throw new Error("Department doesnt exist");
        }
        if(!newNurse){
            throw new Error("invalid data");
        }
        const exist = await prisma.user.findUnique({
            where:{
                email:newNurse.email
            }
        })
        if(exist){
            throw new Error("user already exist");
        }
        const createdNurseUser = await prisma.user.create({
            data:{
                            name : newNurse.name,
                            email:newNurse.email,
                            password:(await bcrypt.hash(newNurse.password,10)).toString(),
                            phone:newNurse.phone,
                            role:"NURSE",
                            gender:newNurse.gender,
                            age:newNurse.age

            }
        })
        if(!createdNurseUser){
            throw new Error("couldnt create user try again");
        }
              const newNurseModel =await prisma.nurse.create({
        data:{
            name : newNurse.name,
            userId:createdNurseUser.id,
            departmentId:department.id
        }
      })
      if(!newNurseModel){
        throw new Error("failed nurse creatation");
      }
      return newNurseModel;


    }catch(err : any){
        console.log(err.message);
        throw new Error(err.message);
    }
}