
import { saveUser } from "./signUp_Controller";
import { Request , Response } from "express";

export async function userSignup(req :Request , res : Response){
    if(req.body.email == null){
        return res.status(400).json("email is empty");
    }
        if(req.body.name == null){
        return res.status(400).json("name is empty");
    }
        if(req.body.age == null){
        return res.status(400).json("age is empty");
    }
        if(req.body.password == null){
        return res.status(400).json("password is empty");
    }
        if(req.body.phone == null){
        return res.status(400).json("phone is empty");
    }
    const user = {
        name:req.body.name ,
        email:req.body.email,
        password:req.body.password,
        age : req.body.age,
        gender :req.body.gender,
        phone:req.body.phone ,
        ssn :req.body.ssn
    }
    try{
    const newuser = await saveUser(user) ; 
    return res.status(201).json("user created succefully");
    }
    catch(error ){
          if (error instanceof Error) {
     console.log(error.message);
     return res.status(409).json("user already exist");
    }
}

}
