import React from 'react'
import {
    List,
    ListItem,
    ListItemPrefix,
    Avatar,
    Card,
    Typography,
  } from "@material-tailwind/react";
  import { ToastContainer, toast } from 'react-toastify';

const Notification = ({fetchNotification, notif}) => {
    const handleConfirmOfService = ()=>{
        console.log(notif);
        const reqdata = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials:'include',
            body: JSON.stringify({service_id: notif.service._id, item_id: notif.item._id})
          };
        fetch('https://inventoflow.onrender.com/items/confirmservice', reqdata)
        .then(res=>res.json())
        .then(data=>{
            if(data.status === 'SUCCESS'){
                fetchNotification();
            }
            else{
                toast.error(data.message);
            }
        })
        .catch(err=>{
            toast.error("error while confirming service");
        })
    };
  return (
    <div className='flex'>
        <ToastContainer/>
        <ListItem className='text-black p-1'><div >{notif.notification}</div></ListItem><button className='text-black bg-blue-300 rounded-lg p-1 mx-1' onClick={handleConfirmOfService}>Confirm</button>
    </div>
  )
}

export default Notification