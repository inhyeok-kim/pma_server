import express from 'express';
import { Project } from '../../dao/ProjectDao';
import { getProject, getProjectList, getProjectListOfMember, registProject } from '../../service/ProjectService';
import { jsonMessage } from '../../utils/ResponseUtil';

const router = express.Router();

router.post('/',async (req,res)=>{
    const project = req.body as Project;
    project.status = 'P';
    project.members?.push({memId:res.locals.loginInfo.id});
    project.register = res.locals.loginInfo.id;
    const result = await registProject(project);
    if(result){
        res.send(jsonMessage('0','success',{}));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/my',async (req,res)=>{
    const result = await getProjectListOfMember(res.locals.loginInfo.id);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/',async (req,res)=>{
    const prId = req.query.prId;
    const result = await getProject(prId as string);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});


module.exports = router;