import React from 'react'
import {
    List,
    ListItem,
    ListItemPrefix,
    Avatar,
    Card,
    Typography,
    ListItemSuffix,
  } from "@material-tailwind/react";
const GenerateQRItem = ({item, selectedItem}) => {
  return (
    <ListItem className="m-2 flex" >
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
  )
}

export default GenerateQRItem