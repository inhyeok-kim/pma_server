import express from 'express';
import { Task } from '../../dao/TaskDao';
import { getTask, getTaskList, modifyTask, registTask, removeTask } from '../../service/TaskService';
import { jsonMessage } from '../../utils/ResponseUtil';

const router = express.Router();

router.post('/',async (req,res)=>{
    const task = req.body as Task;
    task.requesterId = res.locals.loginInfo.id;
    task.assignId = res.locals.loginInfo.id;
    
    const result = await registTask(task);
    if(result){
        res.send(jsonMessage('0','success',{}));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;

    const search : Task = req.query;

    const result = await getTask(search);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.put('/',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;

    const task = req.body as Task;
    task.requesterId = loginId
    task.assignId = loginId

    const result = await modifyTask(task);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.delete('/',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;

    const search : Task = req.query;
    search.requesterId = loginId

    const result = await removeTask(search);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/my',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;

    const search : Task = req.query;
    search.searchType = 'or';
    search.requesterId = loginId;
    search.assignId = loginId

    const result = await getTaskList(search);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/project',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;

    const search : Task = req.query;

    const result = await getTaskList(search);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});


module.exports = router;