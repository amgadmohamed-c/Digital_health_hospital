import prisma from "../lib/prisma";




export default async function  saveCancelSurgery(id:string) {
    try{
        const Cancelled = await prisma.surgery.update({
            where:{id:id} ,
            data:{
                surgeryStatus:"CANCELLED"
            }
        })
        if(!Cancelled){
            throw new Error("something went wrong");
        }
        return Cancelled ;
    }
    catch(err:any){
        throw new Error(err.message);
    }
    
}