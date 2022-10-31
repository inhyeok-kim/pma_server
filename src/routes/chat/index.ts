import express from 'express';
import { Chat, ChatRoom } from '../../dao/ChatDao';
import { getChat, getChatList, getChatRoom, getDirectChatRoomIdWithMember, getDirectChatRoomList, registChatRoom } from '../../service/ChatService';
import { jsonMessage } from '../../utils/ResponseUtil';

const router = express.Router();

router.post('/room',async (req,res)=>{
    const room = req.body as ChatRoom;
    const loginId = res.locals.loginInfo.id;
    room.membersId?.push(loginId);
    const result = await registChatRoom(room);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/rooms/direct',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;
    const room : ChatRoom = {
        memId : loginId
    }
    const result = await getDirectChatRoomList(room);
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/room/direct/with',async (req,res)=>{
    const loginId = res.locals.loginInfo.id;
    const memId = req.query.memId;
    const room : ChatRoom = {
        membersId : [loginId, memId]
    }
    const result = await getDirectChatRoomIdWithMember(room)
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/room',async (req,res)=>{
    const chrId = req.query.chrId;
    const room : ChatRoom = {
        chrId : chrId as string
    }
    const result = await getChatRoom(room)
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/list',async (req,res)=>{
    const chat : Chat = req.query;
    const result = await getChatList(chat)
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});

router.get('/',async (req,res)=>{
    const chat : Chat = req.query;
    const result = await getChat(chat)
    if(result){
        res.send(jsonMessage('0','success',result));
    } else {
        res.send(jsonMessage('E0','failed',{}));
    }
});



module.exports = router;