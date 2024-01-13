const router = require('express').Router();

router.post('/usersignup',(req, res, next)=>{
    res.send('there we are');
})

router.get('/usersignup',(req, res, next)=>{
    res.send('there we are');
})

module.exports = router;