import express from 'express';
import { Schedule } from '../../dao/ScheduleDao';
import { getSchedule, getScheduleList, modifySchedule, registSchedule, removeSchedule } from '../../service/ScheduleService';
import { jsonMessage } from '../../utils/ResponseUtil';

const router = express.Router();

router.post('/',async (req,res)=>{
    const schedule = req.body as Schedule;
    schedule.registerId = res.locals.loginInfo.id;
    
    const result = await registSchedule(schedule);
    if(result){
        res.send(jsonMessage('0','success',{}));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;

    const search : Schedule = req.query;

    const result = await getSchedule(search);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.put('/',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;

    const schedule = req.body as Schedule;
    schedule.registerId = loginId

    const result = await modifySchedule(schedule);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.delete('/',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;

    const search : Schedule = req.query;
    search.registerId = loginId

    const result = await removeSchedule(search);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/my',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;

    const search : Schedule = req.query;
    search.registerId = loginId;

    const result = await getScheduleList(search);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/project',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;

    const search : Schedule = req.query;

    const result = await getScheduleList(search);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});


module.exports = router;