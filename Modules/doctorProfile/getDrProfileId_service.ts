import prisma from "../lib/prisma";

export default async function doctorProfileId(id : string){
    try{
        const user = await prisma.user.findUnique({
            where:{id : id}
        }) ; 
        if(!user){
            throw new Error("user not found");
        }
        const doctor = await prisma.doctor.findUnique({
            where:{userId : user.id}
        })
        if(!doctor){
            throw new Error("doctor not found");
        }
        return({
            name : user.name , 
            age : user.age, 
            email : user.email , 
            doctor
        })

    }catch(err:any){
        throw new Error(err.message);
    }
}