import prisma from "../lib/prisma";

export default async function patientProfileId(id : string){
    try{
        const user = await prisma.user.findUnique({
            where:{id : id}
        }) ; 
        if(!user){
            throw new Error("user not found");
        }
        const patient = await prisma.patient.findUnique({
            where:{userId : user.id}
        })
        if(!patient){
            throw new Error("doctor not found");
        }
        return({
            name : user.name , 
            age : user.age, 
            email : user.email , 
            patient
        })

    }catch(err:any){
        throw new Error(err.message);
    }
}