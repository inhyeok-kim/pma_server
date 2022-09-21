import express from 'express';
const router = express.Router();

router.get('/',(req,res)=>{
    res.send('hi this is test');
    console.log(res.locals.loginInfo.id);
});

export default router;
module.exports = router;