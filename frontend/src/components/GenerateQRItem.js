import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
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
const GenerateQRItem = ({fetchItemsByArea, item, setSelectedArea,setSelectedItemFromP, selectedItem, setSelectedItem, setIsQRAvailable, isQrAvailable, setQrData, qrData}) => {
  
  const navigate = useNavigate();
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
  const handleShowItemDetails = ()=>{
    setSelectedItemFromP(item);
    setSelectedArea(item.area);
    fetchItemsByArea(item.area);
    navigate("/user/item");
  }
  return (
    <div className='flex'>
    <ListItem className="m-2 flex" onClick={handleShowItemDetails}>
      <ToastContainer/>
      
      <ListItemPrefix className="w-1/6">
        <Avatar
          variant="circular"
          alt="Item Image"
          src={item.imageUrl?item.imageUrl:require('./img/default-placeholder.png')}
          className="w-24 h-24"
        />
      </ListItemPrefix>
      <div className="alig w-5/6 flex flex-col">
        <Typography variant="h6" color="blue-gray" className="self-start text-lg">
          {item.name}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal self-end mr-16">
          S/N: {item.serialNumber}
        </Typography>
      </div>
      
    </ListItem>
    <MdOutlineQrCode onClick={handleGenerateQR} className='cursor-pointer text-customeColor-400 self-center' size={30}/>
    </div>
    
  )
}

export default GenerateQRItem