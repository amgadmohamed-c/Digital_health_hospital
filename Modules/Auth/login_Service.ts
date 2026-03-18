
import prisma from "../lib/prisma";
type userdata ={
    email:string ,
    password:string
}

export  async function UserLogin(data : userdata){
    try{
        const user = await prisma.user.findUniqueOrThrow({
            where:{
                email:data.email,
                password:data.password
            }
        })
        return user;
    }catch(error){
        if(error instanceof Error ){
            throw new Error(error.message||"user name or password is wrong");
        }
    }
}