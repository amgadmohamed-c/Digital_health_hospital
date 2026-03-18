import 'dotenv/config'
import prisma from '../lib/prisma';

import type { Gender } from '@prisma/client'
import bcrypt from "bcrypt";



type CreateUserInput = {
  name: string
  email: string
  password: string
  phone: string
  age: number
  gender?: Gender
}

export async function saveUser(user:CreateUserInput){
    const exist = await prisma.user.findUnique(
        {
            where:{email:user.email} 
        }
    )
    if(!exist){
        const hashedPassword = await bcrypt.hash(user.password, 10)
         try{
        const newUser = await prisma.user.create({
            data:{
                name : user.name ,
                email : user.email ,
                password : hashedPassword,
                phone : user.phone,
                age : user.age ,
                gender:user.gender
            }
            
        })
    }
    catch(error){
     if (error instanceof Error) {
     console.log(error.message);
     throw new Error(error.message)
    }
    }
    }else{
        throw new Error("user already exist") ;
    }
    

}