import prisma from "../lib/prisma";

export default async function getAllCases(){
    try{
        const cases = await prisma.emergencyQueue.findMany();
 
        return cases;
    }
    catch(err:any){
        throw new Error(err.message);
    }
}


export async function getActiveCases(){
    try{
        const data = await prisma.emergencyQueue.findMany({
            where:{
                status:"IN_TREATMENT"
            }
        })
        if(data.length ==0){
            throw new Error("no data was found");
        }
        return data
    }catch(err:any){
        throw new Error(err.message);
    }
}
export async function getCriticalCases(){
    try{
        const data = await prisma.emergencyQueue.findMany({
            where:{
                priority : "CRITICAL"
            }
        })
        if(data.length ==0){
            throw new Error("no data was found");
        }
        return data
    }catch(err:any){
        throw new Error(err.message);
    }
}