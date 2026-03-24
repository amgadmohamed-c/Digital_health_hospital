
import bcrypt from "bcrypt"

import prisma from "../lib/prisma";
type userdata ={
    email:string ,
    password:string
}

export  async function UserLogin(data : userdata){
    try{
        const user = await prisma.user.findUnique({
            where:{
                email:data.email,
            }
        })
        if(user){
        const doesExist= await bcrypt.compare(data.password,user.password)
        if(!doesExist){
            throw new Error("password is incorrect");
        }
        return user;
    }


        
    }catch(error){
        if(error instanceof Error ){
            throw new Error(error.message||"user name or password is wrong");
        }
    }
}