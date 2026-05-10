import prisma from "../lib/prisma";

export default async function getSurgeryRoomsService() {
    try{
        const allRooms = await prisma.room.findMany();

        console.log("ALL ROOMS:", allRooms);
        const departments = await prisma.department.findMany();

        console.log("ALL DEPARTMENTS:", departments);
        const dep = await prisma.department.findFirst({
            where:{name:"SURGERY"}
        })
        if(!dep){
            throw new Error("department Doesnt exist yet");
        }
        const rooms = await prisma.room.findMany({
            where:{departmentId : dep.id} ,
            include:{surgeries:true }
        })
        console.log("ROOMS:", rooms);

        return rooms
    }
    catch(err:any){
        throw new Error(err.message);

    }
    
}