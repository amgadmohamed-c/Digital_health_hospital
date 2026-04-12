import prisma  from "../lib/prisma";

export default async function patientData(patient:string)
{
    try{
        const myPatient = await prisma.user.findUnique({
            where:{email:patient}
        })
        if(!myPatient){
            throw new Error("user not found");
        }
        const patientProfile= await prisma.patient.findUnique({
            where:{userId : myPatient.id}
        })
        if(!patientProfile){
            throw new Error("patient profile not found");
        }
        
        return {
           name: myPatient.name,
           email: myPatient.email,
           phone: myPatient.phone,
           age: myPatient.age,
           gender: myPatient.gender,
           patientProfile
               } 

    }
    catch(err:any){
        throw new Error(err.message);
    }
}