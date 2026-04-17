import { Request,Response  , NextFunction} from "express";
import "dotenv/config"  // ✅ this actually loads the .env file
import { saveRefreshtoken, UserLogin, validateRefreshToken } from "./login_Service";
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
        if(!user){
            throw new Error("user doesnt exist")
        }
        const access_Token= jwt.sign({
            email:user?.email,
        },process.env.ACCESS_TOKEN_SECRET! , {expiresIn:"15m"});
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();        
            const refresh_Token = jwt.sign({
            email:user?.email},
        process.env.REFRESH_TOKEN_SECRET! , {expiresIn :"7d"})
        const refreshTokendata = {
            token : refresh_Token.toString() , 
            useremail : user.email ,
            expiresat:expiresAt

        }
        
        const refreshToken = await saveRefreshtoken(refreshTokendata)
        
        res.json({
            access_Token:access_Token,
            expiresin: new Date(Date.now() + 15*60*1000).toISOString(),
            refresh_Token:refresh_Token,
            role:user?.role ,
            ...(user.patient && user.patient), 
            ...(user.doctor && user.doctor)

        })
    }catch(errors){
        if(errors instanceof Error){
        return res.status(401).json(errors.message)
        
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
            console.log(req.user);
            next();
        });

    }
    
}

export async function createnewtoken(req : Request , res :Response){
    const token = req.body.token ; 
    try{
        const mytoken = await validateRefreshToken(token) ;
        if(Date.now() > mytoken.expiresAt.getTime()){ 
            return res.status(403).json("token is expired") 
        }
        try {
      const decoded =   jwt.verify(mytoken.token , process.env.REFRESH_TOKEN_SECRET! );
          }catch(err:any){
            return res.status(401).json("token is invalid")
          }
        const access_Token = jwt.sign({
           email: mytoken.userId 
        } , process.env.ACCESS_TOKEN_SECRET! , {expiresIn:"15m"})

        return res.json({
            access_Token:access_Token,
            expiresin: new Date(Date.now() + 15*60*1000).toISOString(),
        })
        

    }catch(error : any){
        return res.status(401).json(error?.message)
    }
    

}