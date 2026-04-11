import { emit } from "node:cluster";
import prisma from "../lib/prisma";

type doctorData = {
    name ?: string , 
    bio ? :string ,
    email : string  
    specilization ? : string  , 
    img ? :string ,
}
export default async function editDoctorProfile  (newDoctor :doctorData) {
    try {
        if(!newDoctor.email){
            throw new Error("email is null or invalid");
        }
        const doctor = await prisma.user.update({
            where:{ email: newDoctor.email} , 
            data :{ 
                ...( newDoctor.name && {name : newDoctor.name}) , 
            }
        }) ; 
        const editDoctor = await prisma.doctor.update({
            where:{userId : doctor.id}, 
            data:{
                ...(newDoctor.bio && {bio : newDoctor.bio} ),
                ...(newDoctor.specilization && {specialization : newDoctor.specilization}),
                ...(newDoctor.img && {img : newDoctor.img}) 
 
            }
        }) ; 
        return true
    }
     catch(err :any ){
        throw new Error(err.message); 

     }
}