import { Request,Response  , NextFunction} from "express";
import "dotenv/config"  // ✅ this actually loads the .env file
import { UserLogin } from "./login_Service";
import  jwt, { VerifyErrors,JwtPayload } from "jsonwebtoken";

export interface customRequest extends Request {
    user : JwtPayload | string 
}
export  async function Login_Auth(req:Request,res:Response){
    try{
        const email:string =req.body.email ;
        const password:string = req.body.password;
        const userdata = {
            email,
            password
        }
        const user = await UserLogin(userdata);
        const access_Token= jwt.sign({
            email:user?.email,
        },process.env.ACCESS_TOKEN_SECRET!)
        
        res.json({
            access_Token:access_Token,
            role:user?.role

        })
    }catch(errors){
        if(errors instanceof Error){
        res.json(errors.message)
        }
    }
    
    
}


export function Authenticate_Token(req :customRequest , res :Response , next : NextFunction) {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    if(token == null) return res.status(401).send("Token required");
    if(process.env.ACCESS_TOKEN_SECRET){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: VerifyErrors | null, user: JwtPayload | string | undefined) => {
            if(err) return res.status(403).send("Invalid token");
            req.user = user! ; 
            next();
        });

    }
    
}