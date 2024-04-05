import React, { useEffect, useRef, useState} from 'react'
import {IoCloseOutline} from 'react-icons/io5'
import {
    List,
    Card,
  } from "@material-tailwind/react";
import {ShimmerCategoryList} from "react-shimmer-effects";
import Service from './Service';
import { ToastContainer, toast } from "react-toastify";
const Services = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedService, setSelectedService] = useState(null);
    const [serviceList, setServiceList] = useState(null);
    const searchRef = useRef("");
    const [itemList, setItemList] = useState(null);
    const [networkCall, setNetworkCall] = useState(true);
    const composeEmail = () => {
      window.location.href = `mailto:${selectedService.providerDetails.contactEmail}?subject=${encodeURIComponent("subject")}&body=${encodeURIComponent("body")}`;
    };
    function getSum(inti,part){
      return inti+part.partCost;
    }
    const handleSearch=(e)=>{
      if(searchRef.current.value==''){
        fetchServiceList();
        return;
      }
      const url = `https://inventoflow.onrender.com/items/searchservice/${searchRef.current.value}`
      const option = {
        method:"POST",
        credentials:'include',
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        }
      }
      fetch(url,option)
      .then(response=>response.json())
      .then(res=>{
        if(res.status==='SUCCESS'){
          if(!res.items || res.items.length==0){
            setItemList(null);
            return;
          }
          setItemList(res.items);
        }else{
          toast.error(res.message);
        }
      }).catch(err=>{
        toast.error("Error while searching!");
        console.error("Error",err)
      })
    }
    const fetchServiceList = ()=>{
      try{
        const reqdata = {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials:'include',
        };
        fetch('https://inventoflow.onrender.com/items/getallservices', reqdata)
          .then(res=>res.json())
          .then(data=>{
            if(data.status === 'SUCCESS'){
              setServiceList(data.services);
              setItemList(data.items);
              setNetworkCall(false);
            }else{
              toast.error(data.message);
            }
          })
          .catch(err=>{
            toast.error("Error while fetching services!");
            console.error("error", err);
          })
      }catch(err){
        toast.error("Error while fetching services!");
        console.error("error", err);
      }
    }
    useEffect(()=>{
      fetchServiceList();
    },[]);
  return (
    <div className='h-5/6 flex flex-col w-full'>
      <ToastContainer/>
        <div className='h-10 flex-none font-sans text-2xl ml-5 mt-5 '>Services List</div>
        <div className="flex-none mx-4 my-8 h-10 w-5/6">
            <input
              type="text"
              className="block h-8 w-72 px-2 py-2  text-gray-700 w-full bg-white border rounded-md focus:border-zinc-700 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Search service..."
              onChange={handleSearch}
              ref={searchRef}
            />
        </div>
        <Card className='grow h-5/6'>
            <List className="overflow-y-scroll ">
                <div className="">
                    {
                    //  !networkCall ? serviceList.map((service) => (<List><Service service={service} /></List>
                    !networkCall ? (itemList? itemList.map((item) => {
                        const displayService=[];
                        if(item.servicePending[0]){
                          item.servicePending.map((service)=>{ displayService.push(<List><Service setSelectedItem={setSelectedItem} setSelectedService={setSelectedService} item={item} service={service} /></List>)})
                        }
                        if(item.servicesHistory[0]){
                          item.servicesHistory.map((service)=>{ displayService.push(<List><Service setSelectedItem={setSelectedItem} setSelectedService={setSelectedService} item={item} service={service} /></List>)});
                        }
                        return displayService.map(service=>service);
                    }
                    ): <div className='text-lg'>No Service Found</div>):<ShimmerCategoryList title items={4} categoryStyle="STYLE_ONE" />
                    
                    }
                </div>
            </List>
        </Card>
        {
       selectedService ? (
        <div className="fixed inset-0 flex flex-row items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white flex flex-col p-2 rounded-md shadow-md">
            <IoCloseOutline className='text-black self-end cursor-pointer size-7' onClick={()=>{setSelectedService(false)}}/>
            <div className="ml-2 text-xl">Service Details</div>
            <div className='flex flex-row p-2 items-center'>
              <div className='flex flex-col justify-center ms-2'>
                <p className='text-black text-md font-medium m-2'>Item: {selectedItem.name}</p>
                <p className='text-black text-md font-medium m-2'>Department: {selectedItem.area.name}</p>
                <p className='text-black m-2'>serviceDate: {selectedService.serviceDate}</p>
                <p className='text-black m-2'>serviceType: {selectedService.serviceType}</p>
                <p className='text-black m-2'>serviceDescription: {selectedService.description}</p>
                {
                  selectedService.parts[0]?
                  <div className='flex flex-col justify-center ms-2'>
                    <div className="border border-black rounded-2">
                      <div className='text-black text-lg m-2'>service parts</div>
                        {selectedService.parts.map(part=><div className="flex">
                          <p className='text-black ml-4 mb-2'>part name: {part.partName}</p>
                          <p className='text-black ml-4 mb-2'>part cost: {part.partCost}</p>
                        </div>)}
                    <div className="ml-4 text-md font-medium">Total cost: {selectedService.parts.reduce(getSum,0)}</div>
                  </div>
                </div>:<></>
      }
      </div>
      {
        selectedService.providerDetails.name?
        <div className='flex flex-col justify-center ms-2'>
        <div className="border border-black p-2">
          <div className='text-black text-lg m-2'>service provider</div>
          <div className="flex">
            <div>
              {selectedService.providerDetails.name&&<p className='text-black ml-4 mb-2'>Name: {selectedService.providerDetails.name}</p>}
              {selectedService.providerDetails.contactNumber&&<p className='text-black ml-4 mb-2'>Number: {selectedService.providerDetails.contactNumber}</p>}
              {selectedService.providerDetails.contactEmail&&<p className='text-black ml-4 mb-2'>Email: {<button onClick={composeEmail}>{selectedService.providerDetails.contactEmail}</button>}</p>}
            </div>
            {selectedService.providerDetails.description && <p className='text-black ml-4 mb-2'>description: {selectedService.providerDetails.description}</p>}
          </div>
          
        </div>
        
        </div>:<></>
      }
      
    </div>
    {/* <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md self-end justify-end" onClick={()=>{setSelectedService(null)}}>
      Close
    </button> */}
  </div>
</div>
      ): <></>
      }
    </div>
  )
}

export default Services