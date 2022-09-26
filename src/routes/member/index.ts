import express from 'express';
import { Member } from '../../dao/MemberDao';
import { getMember, getMemberList } from '../../service/MemberService';
import { jsonMessage } from '../../utils/ResponseUtil';

const router = express.Router();

router.get('/search',async (req,res)=>{
    const search : Member = req.query;
    search.memId = res.locals.loginInfo.id;
    const list = await getMemberList(search);
    res.send(jsonMessage('0','',list));
});

router.get('/me',async (req,res)=>{
    const search : Member = req.query;
    search.memId = res.locals.loginInfo.id;
    const list = await getMember(search);
    res.send(jsonMessage('0','',list));
});



module.exports = router;