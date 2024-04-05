import React from 'react'
import {
    ListItem,
    ListItemPrefix,
    Card,
  } from "@material-tailwind/react";
const Service = ({setSelectedItem, setSelectedService, item, service}) => {
    const handleShowService =()=>{
        console.log(item, service);
        setSelectedItem(item?item:null);
        setSelectedService(service?service:null);
    }
  return (
    <ListItem onClick={handleShowService} className='p-1 w-full'>
        <ListItemPrefix className='text-lg w-2/6'>
            {item?item.name:null}
        </ListItemPrefix>
        <div className='text-md w-2/6'>{service? service.serviceDate:null}</div>
        <div className='text-md w-2/6'>{service?service.serviceType:null}</div>
    </ListItem>
  )
}

export default Service