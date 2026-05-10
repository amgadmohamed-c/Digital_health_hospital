import prisma from "../lib/prisma";


export default async function getAllSurgeriesService() { 

    const surgeries = await prisma.surgery.findMany({});
    
}