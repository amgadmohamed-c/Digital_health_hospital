import prisma from "../lib/prisma"; 

export default async function getAllNurses(){
    try{
        const nurses = await prisma.user.findMany({
            where:{role:"NURSE"} , 
            include:{
                nurse:{
                    include:{
                        department:true
                    }
                 }, 
                }})
              console.log(nurses);
              return nurses;
    }
    catch(err:any){
        throw new Error(err.message);
    }
}