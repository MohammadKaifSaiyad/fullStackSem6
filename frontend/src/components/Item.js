import React from "react";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
  ListItemSuffix,
} from "@material-tailwind/react";
import User from "./UserDashboard";
import { toast, ToastContainer} from "react-toastify";

function Item({ item, selectedItem, setSelectedItem}) {
  const navigate = useNavigate();
  const handelItemDisplay=async (e)=>{
    console.log("selected item id:",item._id);

    const options = {
      method:'POST',
      headers:{'content-type': 'application/json'},
      body:await JSON.stringify({item_id:item._id})
    }
    fetch('/items/getitem',options)
    .then(res=>res.json())
    .then(data=>{
      if(data.status ==='SUCCESS'){
        setSelectedItem(data.item_detail)
        navigate('/user/item');
      }else{
        toast.error(data.message);
      }
    })
    .catch(err=>{
      toast.error('Error while retrieving item Details!')
    })
  }
  return (
    <ListItem className=" flex bg-white" onClick={handelItemDisplay}>
      <ListItemPrefix className="w-1/6">
        <Avatar
          variant="circular"
          alt="Item Image"
          src={item.imageUrl?item.imageUrl:require('./img/default-placeholder.png')}
          className="w-24 h-24"
        />
      </ListItemPrefix>
      <div className="alig w-5/6 flex flex-col">
        <Typography variant="h6" color="blue-gray" className="self-start text-xl">
          {item.name}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal self-end mr-16 text-md">
          S/N: {item.serialNumber}
        </Typography>
      </div>
    </ListItem>
  );
}

export default Item;
