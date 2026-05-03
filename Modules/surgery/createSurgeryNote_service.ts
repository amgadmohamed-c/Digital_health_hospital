import prisma from "../lib/prisma";

export default async function createSurgeryNote(
    surgeryId: string,
    content: string
) {
    // Validate surgery exists
    const surgery = await prisma.surgery.update({where:{ id: surgeryId }, data: {
        notes: content
    }});
    if (!surgery) throw new Error("Surgery not found");
    return surgery;

}
