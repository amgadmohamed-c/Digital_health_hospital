import prisma from "../lib/prisma";


export default async function  DeleteUser(id:string){
    try{
        const deletedUser = await prisma.user.delete({
            where:{id : id} , 
            include:{
                patient:true ,
                doctor:true , 
                nurse:true 
            }
        })
        if(!deletedUser){
            throw new Error("user didnt exist or deletion failed");
        }
        return deletedUser ; 

    }catch(err:any){
        throw new Error(err.message)

    }
    
}