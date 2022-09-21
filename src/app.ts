import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';
import JWTCheck from './middleware/JWTCheck';

const app = express();

/**
 * 세팅
 */
app.use(cors({
    origin:'http://localhost:3000',
    credentials : true
}))
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use('/',JWTCheck);

/**
 * 라우팅
 */
try {
    const services = fs.readdirSync(__dirname+'/routes');
    services.forEach((service)=> {
        app.use('/'+service,require(__dirname+'/routes/'+service));
    })
} catch (error) {
    console.error(error);
}

app.get('/',(req,res)=>{
    res.send('hi');
});

app.listen(4000,()=>{

});