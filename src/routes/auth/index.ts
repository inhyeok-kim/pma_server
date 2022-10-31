import express from 'express';
import { Member } from '../../dao/MemberDao';
import { login } from '../../service/AuthService';
import { getMember } from '../../service/MemberService';
import {getToken, verify} from '../../utils/JWTManage';
import { jsonMessage } from '../../utils/ResponseUtil';

const router = express.Router();

router.post('/',async (req,res)=>{
    const body = req.body;

    const result :any = await login(body);
    if(result.MEM_ID){
        const token = await getToken({id:body.id});
        res.cookie('act',token,{
            maxAge : new Date().setDate(new Date().getDate()+10),
            httpOnly : true
        });
        res.send(jsonMessage('E0','access approved'));
    } else {
        res.send(jsonMessage('E1','access denied'));
    }
});

router.get('/',async (req,res)=>{
    let flag = false;
    if(req.cookies){
        if(req.cookies.act){
            const result = await verify(req.cookies.act)
            if(result) {
                const member : Member = {
                    memId : Object.values(result)[0]
                }
                const login = await getMember(member);
                if(login){
                    flag = true;
                }
            }
        }
    }
    if(flag){
        res.send(jsonMessage('0','access approved'));
        res.end();
    } else {
        res.send(jsonMessage('A1','Need Login'));
        res.end();
    }
});

router.get('/logout',async (req,res)=>{
    res.clearCookie('act');
    res.end();
});

module.exports = router;