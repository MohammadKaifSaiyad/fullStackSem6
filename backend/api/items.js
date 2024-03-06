const router = require('express').Router();
const loggedinuser = require('../models/loginedUserSchema');
const areaModel = require('../models/areaSchema');
const itemModel = require('../models/itemSchema')
const { checkCookies } = require('../auth/checkCookies');
const jwt = require('jsonwebtoken');
const LoggedinUserModel = require('../models/loginedUserSchema');
const QRCode = require('qrcode');
const serviceModel = require('../models/serviceSchema');
const { json } = require('body-parser');

router.post('/getareas',checkCookies ,async (req, res)=>{
    await loggedinuser.findById(req.body.user_id).populate('areas','name')
    .then(user=>{
        console.log(user)
        if(!user)
        {
            res.json({
                status: 'FAILED',
                message: 'fail to fetch areas list',
            });
            return res;
        }
        res.json({
            status: 'SUCCESS',
            areasId: user.areas,
        })
        return res;
    })
})

router.post('/addarea',checkCookies ,async(req,res)=>{
    const userId=req.body.user_id;
    console.log("request body for addarea", req.body);
    console.log("inside back addarea",userId);
    let areaId;
    const newArea = new areaModel({
        name:req.body.area,
        location:req.body.area_location?req.body.area_location:null
    })
    await newArea.save().then(area=>{
        areaId = area._id;
        console.log('areaId value: ',areaId);
    })
    const userData = await loggedinuser.findById(userId);
    if(!userData){
        res.json({
            status:'FAILED',
            message:'failed to add area!'
        })
        return res;
    }
    console.log("before user:",userData)
    userData.areas.push(areaId)
    await userData.save();
    console.log("after user:",userData)
    res.json({
        status:'SUCCESS',
        message:'area is added successfully!'
    })
    
    
})
router.post('/additem',async(req, res)=>{
    const area = await areaModel.findById(req.body.area_id);
    console.log("item image:",req.file,"additem body", req.body, req.data);
        if(!area){
            res.json({
                status:'FAILED',
                message:'failed to add item in area!'
            })
            return res;
        }
        console.log("area",area);
        const user = await LoggedinUserModel.findById(req.body.user_id);
        if(!user){
            res.json({
                status:'FAILED',
                message:'failed to add item in area!'
            })
            return res;
        }
        console.log("area")
    console.log("inside additem api");
    const userId=req.body.user_id;
    console.log("req body for adding item:",req.body);
    if(!userId){
        res.json({
            status:'FAILED',
            message:'invalid user!'
        })
        return res;
    }
    let itemId;
    let check =0;
    let code = null;
    console.log("inside add item:",req.body);
    const newItem = new itemModel({
        name:req.body.item_name,
        installationDate:req.body.installation_date?req.body.installation_date:Date.now(),
        user:user._id,
        area:area._id,
        serialNumber:req.body.serial_number?req.body.serial_number:null
    })
    // newItem.user=user._id;
    console.log("new item:",newItem);
    const item = await newItem.save();
    if(!item){
        res.json({
            status:'FAILED',
            message:'cannot save the item!'
        })
        return res;
    }
    itemId = item._id;
    // item.area=req.body.area_id;
    // item.user=req.body.user_id;
    
        if(req.body.generate_qr == true){
            try{
                code = await item.generateQRCode();
                console.log("code after generate:",code);
            }catch(err){
                res.json({
                    status:'FAILED',
                    message:'error while generating the qrcode!'
                })
                return res;
            }
        }
        await item.save();
        
        await area.items.push(itemId)
        await area.save();
        if(code!=null){
            console.log("afeter")
        }
        console.log("code:",code);
        res.json({
            status:'SUCCESS',
            message:'item is added successfully!'
        })
    res.json({
        status:'SUCCESS'
    })
    return res;
})



router.post('/getitems',async (req, res)=>{
    console.log(req.body.area_id)
    try{
    //     await areaModel.findById(req.body.area_id).populate('items','name')
    // .then(area=>{
    //     if(!area)
    //     {
    //         res.json({
    //             status: 'FAILED',
    //             message: 'fail to fetch items list',
    //         });
    //         return res;
    //     }
    //     res.json({
    //         status: 'SUCCESS',
    //         item_list: area.items
    //     })
    //})
    // const area = await areaModel.findById(req.body.area_id);
    if(!req.body.area_id){
        res.json({
            status:'FAILED',
            message:'area is null!'
        })
    }
        const results=await areaModel.aggregate([{
            $lookup:{
                from:'items',
                localField:'items',
                foreignField:'_id',
                as:'item_list'
            }
        }])
        if(!results){
            res.json({
                status:'SUCCESS',
                results:result
            })
            return res;
        }
        const result=await results.filter(area=>area._id==req.body.area_id);
        res.json({
            status:'SUCCESS',
            item_list:result[0].item_list
        })
    
    }catch(err){
        res.json({
            status: 'FAILED',
            message:'Error while fetching item list!'
        })
    }
    return res;
})

router.post('/getitem',checkCookies ,async (req, res)=>{
    itemModel.findById(req.body.item_id).populate('servicesHistory').populate('servicePending')
    .then(item=>{
        if(!item){
            res.json({
                status: 'FAILED',
                message:'Error while fetching item not found!'
            })
            return res;
        }
        if(item.user != req.body.user_id){
            res.json({
                status: 'FAILED',
                message:'Trying to access item that not belong to user!'
            })
            return res;
        }
        res.json({
            status: 'SUCCESS',
            item_detail: item
        })
    }).catch(err=>{
        res.json({
            status: 'FAILED',
            message: 'Error while fetching item detail at backend!'
        })
    })
})

router.post('/search/:key',checkCookies, async(req,res)=>{
    console.log(req.params.key);
    itemModel.find({
        "$or":[
            {"name":{$regex:req.params.key}},
            {"serialNumber":{$regex:req.params.key}}
        ],
        "$and":[{user:req.body.user_id, area:req.body.area_id}]
    }).then(data=>{
        res.json({
            status:"SUCCESS",
            search_result:data
        })
        return res;
    })
    .catch(err=>{
        res.json({
            status:"FAILED",
            message:"Error while searching the data!"
        })
        return res;
    })

})

router.post('/deleteitem',checkCookies,async (req, res)=>{
    console.log('inside delete item')
    try{
        const area = await areaModel.findById(req.body.area_id);
        if(!area){
            res.json({
                status:'FAILED',
                message:'no such area found in database!'
            })
            return res;
        }
        await area.items.filter(item=>req.body.item_id != item._id);
        await itemModel.findByIdAndDelete(req.body.item_id);
        const newArea = await area.save();
        console.log('new area datad: ', newArea);
        if(!newArea){
            res.json({
                status:'FAILED',
                message:'no such area found in database!'
            })
            return res;
        }
        res.json({
            status:'SUCCESS',
            message:'item deleted successfully form area!'
        })
        return res;
    }catch(err){
        res.json({
            status:'FAILED',
            message:'Error while deleting item!'
        })
        return res;
        console.log('error while deleting item', err);
    }
    return res;
})

router.get('/generateqr/:item_id', async(req, res)=>{
    console.log(req.body, req.data);
    const item = await itemModel.findById(req.params.item_id)
    if(!item){
        res.json({
            status:'FAILED',
            message:'item with given id not exist!'
        })
        return res;
    }
    if(!item.qrCode){
        res.json({
            status:'FAILED',
            message:'generate qr code first!'
        })
        return res;
    }
    // QRCode.toFile('/frontend/qr1.png', `www.google.com`, { errorCorrectionLevel: 'H' });
    QRCode.toDataURL(`http:/localhost:5000/api/view/itemdetails/${item.qrCode}`, { errorCorrectionLevel: 'H' }, function (err, url) {
        if(err){
            res.json({
                status:'FAILED',
                message:'Error while generation qr!'
            })
            return res;
        }
        res.json({
            status:'SUCCESS',
            qrdata: url
        })
        return res;
      })
      
    return res;
})

router.post('/getitembyqr',checkCookies, (req, res)=>{
    console.log('inside getitembyqr');
    itemModel.findOne({qrCode: req.body.item_qr})
    .then(item=>{
        if(!item){
            res.json({
                status: 'FAILED',
                message:'Error while fetching item not found!'
            })
            return res;
        }
        if(item.user != req.body.user_id){
            res.json({
                status: 'FAILED',
                message:'Trying to access item that not belong to user!'
            })
            return res;
        }
        res.json({
            status: 'SUCCESS',
            item_detail: item
        })
        console.log('item details:', item)
        return res;
    }).catch(err=>{
        console.log('error while itemDetail fetch:',err);
        res.json({
            status: 'FAILED',
            message: 'Error while fetching item detail on backend side!'
        })
        
    })
})
router.post('/getitemforview', (req, res)=>{
    console.log('inside getitembyqr');
    itemModel.findOne({qrCode: req.body.item_qr})
    .then(item=>{
        if(!item){
            res.json({
                status: 'FAILED',
                message:'Error while fetching item not found!'
            })
            return res;
        }
        res.json({
            status: 'SUCCESS',
            item_detail: item
        })
        console.log('item details:', item)
        return res;
    }).catch(err=>{
        console.log('error while itemDetail fetch:',err);
        res.json({
            status: 'FAILED',
            message: 'Error while fetching item detail on backend side!'
        })
        
    })
})

router.post('/addmaintenance', async(req, res)=>{
    console.log('inside addmaintenance: ',req.body);
    console.log('service id', req.body.service_id && true)
    if(req.body.service_id && true){
        console.log('inside update maintenance');
        const newService = {
            serviceDate:req.body.service_date,
            serviceType:req.body.service_type,
            parts:req.body.service_parts,
            providerDetails:{
                name:req.body.provider_name,
                contactNumber:req.body.provider_number,
                contactEmail:req.body.provider_email,
                description:req.body.provider_details,
            },
            description:req.body.service_description
        }
        console.log('new serivce:', newService);
        const service = await serviceModel.findByIdAndUpdate(req.body.service_id, newService, {new:false});
        console.log('new Service: ', service);
        if(!service){
            res.json({
                status:'FAILED',
                message:'cannot update maintenance!'
            })
            return res;
        }
        const item = await itemModel.findById(req.body.item_id).populate('servicesHistory').populate('servicePending')
        if(!item){
            res.json({
                status:'FAILED',
                message:'cannot find item for updating maintenance!'
            })
            return res;
        }
        res.json({
            status:'SUCCESS',
            item_detail:item
        })
        return res;
    }else{
        console.log('inside add maintenance');
        try{
            const newService = new serviceModel({
                serviceDate:req.body.service_date,
                serviceType:req.body.service_type,
                parts:req.body.service_parts,
                providerDetails:{
                    name:req.body.provider_name,
                    contactNumber:req.body.provider_number,
                    contactEmail:req.body.provider_email,
                    description:req.body.provider_details,
                },
                description:req.body.service_description
            })
            console.log(newService);
            const maintenance = await newService.save();
            if(!maintenance){
                res.json({
                    status:'FAILED',
                    message:'cannot add maintenance!'
                })
                return res;
            }
            const item = await itemModel.findById(req.body.item_id);
            if(!item){
                res.json({
                    status:'FAILED',
                    message:'cannot add maintenance!'
                })
                return res;
            }
            maintenance.item = item._id;
            await maintenance.save();
            if(new Date( req.body.service_date).toISOString().slice(0,10) <=new Date().toISOString().slice(0,10)){
                await item.servicesHistory.push(maintenance._id);
                maintenance.completed = true;
            }
            else{
                await item.servicePending.push(maintenance._id);
                maintenance.completed = false;
            }
            await maintenance.save();
            const result = await item.save().populate('servicesHistory').populate('servicePending');
            if(result){
                res.json({
                    status:'SUCCESS',
                    item_detail:result
                })
            }
        }
        catch(err){
            console.log('Error while adding maintenance:',err);
            res.json({
                status:'FAILED',
                message:'Error while adding maintenance!'
            })
            return res;
        }
    }
    
    return res;
})

router.post('/getservices', (req, res)=>{
    try{
        const service = serviceModel.findById('65dff7e36a6a3cf873f87374').populate('parts')
        .then(service=>{
            if(!service){
                res.json({
                    status:'FAILED',
                    message: 'no service data!',
                })
            }
            res.json({
                data: service,
            })
        })
    }catch(err){
        res.json({
            status:'FAILED',
            message:'Error while fetching services!'
        })
        console.log('Error while fetching services', err);
        return res;
    }
    return res;
})

router.post('/deleteservice', async(req, res)=>{
    try{
        console.log(req.body);
        const item = await itemModel.findById(req.body.item_id);
        if(!item){
            res.json({
                status:'FAILED',
                message:'no such item found in database!'
            })
            return res;
        }
        await item.servicePending.filter(service=> service._id != req.body.service_id);
        console.log('after delete: ', await serviceModel.findByIdAndDelete(req.body.service_id))
        item.save();
        res.json({
            status:'SUCCESS',
            message:'service deleted successfully!'
        })
        return res;
    }catch(err){
        res.json({
            status:'FAILED',
            message:'Error while deleting service!'
        })
        console.log('Error while deleting service',err);
    }
    
})
module.exports = router;