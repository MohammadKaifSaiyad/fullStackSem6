import { ListItem, ListItemSuffix } from "@material-tailwind/react";
import React,{useContext, useEffect} from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context";

function ServiceItem({ service, showHistory, setEdit, deleteService, setSelectedService, selectedService }) {
  const {viewOnlyState} = useContext(Context);
  const [viewOnly, setViewOnly] = viewOnlyState;
  const naviagte = useNavigate();
  const handleDeleteService = (e)=>{
    setSelectedService(e.target.key);
    console.log('selected service: ',service._id);
    deleteService(service._id);
  }
  useEffect(()=>{console.log('value of viewOnly:  ', viewOnly)},[]);
  const handleShowService =()=>{
    console.log('selected serivce: ', service._id);
    setSelectedService(service);
  }
  const handleEditService =()=>{
    setSelectedService(service);
    setEdit(true);
    console.log('selected service', service._id);
    naviagte('/user/item/addmaintenance')
  }
  return (
    <div className="flex h-12 flex-row">
      <ListItem className="h-12 flex" onClick={handleShowService}>
        <p className="justify-self-start w-3/6">{(""+service.serviceDate).slice(0,10)}</p>
        <p className="justify-self-end w-3/6">{service.serviceType}</p>
      </ListItem> 
      {(showHistory && viewOnly) ? null : (
        <ListItemSuffix className="flex flex-row items-center justify-items-center">
          <MdEdit className="cursor-pointer m-1 h-5 w-5" onClick={handleEditService}/>
          <MdDelete className="cursor-pointer m-1 h-5 w-5" onClick={handleDeleteService} />
        </ListItemSuffix>
      )}
    </div>
  );
}

export default ServiceItem;
