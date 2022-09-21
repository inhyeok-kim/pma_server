import express from 'express';
import { seachMemberList } from '../../service/MemberService';
import { jsonMessage } from '../../utils/ResponseUtil';

const router = express.Router();

router.get('/search',async (req,res)=>{
    const list = await seachMemberList(req.query);
    res.send(jsonMessage('0','',list));
});


module.exports = router;