const router = require('express').Router();
const itemModel = require('../models/itemSchema');
const {checkUser} = require('../auth/checkUser');

router.get('/itemdetails/:item_id', checkUser,  (req, res)=>{
    const itemId = req.params.item_id;
    // display a page with itemDetails
    res.redirect(`/view/itemdetails/${req.params.item_id}`);
})

module.exports = router;