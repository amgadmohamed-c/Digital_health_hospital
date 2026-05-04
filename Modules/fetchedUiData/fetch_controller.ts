import { Request , Response } from "express";
import fetch_service from "./fetch_service";

export default async function fetch_controller(req:Request , res:Response){
    try {
        const data = await fetch_service();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
}   