import prisma  from "../lib/prisma";

export default async function doctorData(doctor:string)
{
    try{
        const mydoctor = await prisma.user.findUnique({
            where:{email:doctor}
        })
        if(!mydoctor){
            throw new Error("user not found");
        }
        const doctorProfile= await prisma.doctor.findUnique({
            where:{userId : mydoctor.id}
        })
        if(!doctorProfile){
            throw new Error("doctor profile not found");
        }
        
        return {
           name: mydoctor.name,
           email: mydoctor.email,
           phone: mydoctor.phone,
           age: mydoctor.age,
           gender: mydoctor.gender,
           doctorProfile
               } 

    }
    catch(err:any){
        throw new Error(err.message);
    }
}