import prisma from "../lib/prisma";
import { QueueStatus } from "../../generated/prisma";
type caseInfo = {
    id : string   , 
    status : QueueStatus  
}

export default async function updateCase(caseData: caseInfo) {
    try {
        if (!caseData.id || !caseData.status) {
            throw new Error("case data is invalid");
        }
        const data = await prisma.emergencyQueue.update({
            where: { id: caseData.id },
            data: { status:  caseData.status}
        });
        return data;
    } catch (err: any) {
        throw new Error(err.message);
    }
}