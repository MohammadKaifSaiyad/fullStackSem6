import React,{useState} from 'react'

import { toast ,ToastContainer} from "react-toastify";
import { MdOutlineQrCode } from "react-icons/md";
import {
    List,
    ListItem,
    ListItemPrefix,
    Avatar,
    Card,
    Typography,
    ListItemSuffix,
  } from "@material-tailwind/react";
const GenerateQRItem = ({item, selectedItem, setIsQRAvailable, isQrAvailable, setQrData, qrData}) => {
  
  
  const handleGenerateQR =async ()=>{
    console.log(item._id);
    const options = {
      method:'POST',
      headers:{'content-type': 'application/json'},
      body:await JSON.stringify({item_id:item._id})
    }
    fetch('/items/generateqrcode',options)
    .then(res=>res.json())
    .then(data=>{
      if(data.status === 'SUCCESS'){
        setIsQRAvailable(true);
        setQrData(data.qrdata);
      }else{
        toast.error(data.message);
      }
    })
    .catch(err=>{
      console.log('error while fetching qr:',err);
      toast.error('Can not generate qr!')
    })
  }
  return (
    <div className='flex'>
    <ListItem className="m-2 flex" onClick={()=>{console.log(item)}}>
      <ToastContainer/>
      
      <ListItemPrefix className="w-1/6">
        <Avatar
          variant="circular"
          alt="Item Image"
          src={item.imageUrl?item.imageUrl:require('./img/default-placeholder.png')}
          className="w-20 h-20"
        />
      </ListItemPrefix>
      <div className="alig w-5/6 flex flex-col">
        <Typography variant="h6" color="blue-gray" className="self-start">
          {item.name}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal self-end mr-16">
          S/N: {item.serialNumber}
        </Typography>
      </div>
      
    </ListItem>
    <MdOutlineQrCode onClick={handleGenerateQR} className='cursor-pointer self-center' size={30}/>
    </div>
    
  )
}

export default GenerateQRItem