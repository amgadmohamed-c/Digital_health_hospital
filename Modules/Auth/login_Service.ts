
import bcrypt from "bcrypt"

import prisma from "../lib/prisma";
type userdata ={
    email:string ,
    password:string
}
type refeshtokendata = {
  token:string   ,
  useremail: string
  expiresat : string,
}

export  async function UserLogin(data : userdata){
    try{
        const user = await prisma.user.findUnique({
            where:{
                email:data.email,
            },
            include:{patient:true , 
                doctor:true
            } 
            
        })
        if(user){
        const doesExist= await bcrypt.compare(data.password,user.password)
        if(!doesExist){
            throw new Error("password is incorrect");
        }
            
        return user  
            
        
    }else{
        throw new Error("user not found")
    }
    


        
    }catch(error){
        if(error instanceof Error ){
            throw new Error(error.message||"user name or password is wrong");
        }
    }
}
export async function saveRefreshtoken(tokenData : refeshtokendata) {
    const newtoken = await prisma.refreshToken.create({
        data:{
            token:tokenData.token,
            userId:tokenData.useremail,
            expiresAt:new Date(tokenData.expiresat)
        }
    })
    
}
export async function validateRefreshToken(token:string) {
    try{
    const mytoken = await prisma.refreshToken.findUnique({
        where :{
            token: token
        }
    })
    if(!mytoken){
        throw new Error("token is invalid ");
    }
    return mytoken ; 
   }catch(error:any){
    throw new Error(error?.message || "Token validation failed");
   }
    
    
}