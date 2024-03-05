import { ListItem, ListItemSuffix } from "@material-tailwind/react";
import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";

function ServiceItem({ service, showHistory, deleteService, setSelectedService }) {
  const handleDeleteService = (e)=>{
    setSelectedService(e.target.key);
    console.log('selected service: ',service._id);
    deleteService(service._id);
  }
  return (
    <div className="flex h-12 flex-row">
      <ListItem className="h-12 flex">
        <p className="justify-self-start w-3/6">{(""+service.serviceDate).slice(0,10)}</p>
        <p className="justify-self-end w-3/6">{service.serviceType}</p>
      </ListItem> 
      {showHistory ? null : (
        <ListItemSuffix className="flex flex-row items-center justify-items-center">
          <MdEdit className="cursor-pointer m-1 h-5 w-5" />
          <MdDelete className="cursor-pointer m-1 h-5 w-5" onClick={handleDeleteService} />
        </ListItemSuffix>
      )}
    </div>
  );
}

export default ServiceItem;
