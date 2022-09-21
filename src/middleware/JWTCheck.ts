import { NextFunction, Request, Response } from "express";
import { verify } from "../utils/JWTManage";
import { jsonMessage } from "../utils/ResponseUtil";

export default async function(req : Request,res :Response,next : NextFunction){
    if(req.url.includes('auth')){
        next();
    } else {
        let flag = false;
        if(req.cookies){
            if(req.cookies.act){
                await verify(req.cookies.act)
                .then(result=>{
                    if(result) {
                        flag = true;
                        res.locals.loginInfo = result;
                    }
                });
            }
        }
        if(flag){
            next();
        } else {
            res.send(jsonMessage('A0','Need Login'));
            res.end();
        }
    }

}