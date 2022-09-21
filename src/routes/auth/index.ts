import express from 'express';
import { login } from '../../service/AuthService';
import {getToken} from '../../utils/JWTManage';
import { jsonMessage } from '../../utils/ResponseUtil';

const router = express.Router();

router.post('/',async (req,res)=>{
    const body = req.body;

    const result = await login(body);
    if(result){
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

router.get('/logout',async (req,res)=>{
    res.clearCookie('act');
    res.end();
});

module.exports = router;