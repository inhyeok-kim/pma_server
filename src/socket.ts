import WebSocket, { ErrorEvent, MessageEvent } from 'ws';
import { Chat } from './dao/ChatDao';
import { registChat } from './service/ChatService';
import { verify } from './utils/JWTManage';

declare interface CustomSocket extends WebSocket {
    id : string
}
interface SocketData {
    code : 'access' | 'chat' | 'error'
    body : any
}
export default function ws(server : any){
    const wss = new WebSocket.Server({server});

    const roomManager : any = {};
    wss.on('connection', async (socket : CustomSocket, req)=>{
        const auth : any = await authChek(req);
        if(auth){
            socket.id = auth.id;
            socket.on('message', (meesage : MessageEvent)=>{onMessage(socket,meesage)});
            
            socket.on('error', (err : ErrorEvent)=>{onError(socket,err)});
            
            socket.on('close', ()=>{onClose(socket)});
        } else {
            socket.send('need login');
            socket.close();
        }

    });

    function onMessage(socket :CustomSocket , message : MessageEvent){
        const data : SocketData = JSON.parse(message.toString());
        switch (data.code) {
            case 'access':
                fnAccess(socket,data.body);
                break;
            case 'chat':
                fnChat(socket,data.body);
                break;
        }
    }

    function onError(socket :CustomSocket , err : ErrorEvent){

    }

    function onClose(socket :CustomSocket){
        socket.close();
    }

    async function authChek(req : any){
        const cookies = getCookies(req.headers.cookie);
        const token = cookies.act;
        let flag;
        if(token){
            const result = await verify(token);
            if(result) {
                flag = result;
            }
        }
        return flag;
    }

    function fnAccess(socket :CustomSocket,body : any){
        if(!body.chrId) {
            socket.send(JSON.stringify({code:'access',body : false}));
        };
        if(roomManager[body.chrId]){
            roomManager[body.chrId].push(socket);
        } else {
            roomManager[body.chrId] = [socket];
        }
        socket.send(JSON.stringify({code:'access',body : true}));
    }

    function fnChat(socket :CustomSocket,body : any){
        if(!body.chrId) return null;
        if(!roomManager[body.chrId]) return null;
        if(roomManager[body.chrId].find((v:CustomSocket)=>v.id === socket.id)){
            const newChat : Chat = {
                chContent : body.chContent,
                chrId : body.chrId,
                registerId : socket.id,
                isThread : body.isThread,
                upperCh : body.upperCh,
            }
            registChat(newChat)
            .then(result => {
                roomManager[body.chrId].forEach((so:CustomSocket)=>{
                    so.send(JSON.stringify({code:'chat',body : result}));
                });
            });
        } else {
            return null;
        }

    }

}


function getCookies(cookie : string){
    const cookies : any = {}
    cookie.split(';').map(c=>c.split('=')).forEach(v=>{
        cookies[v[0].trim()] = v[1].trim();
    });
    return cookies;

}