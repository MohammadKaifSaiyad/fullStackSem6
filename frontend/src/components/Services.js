import React, { useEffect, useRef, useState} from 'react'
import {
    List,
    Card,
  } from "@material-tailwind/react";
import {ShimmerCategoryList} from "react-shimmer-effects";
import Service from './Service';
import { ToastContainer, toast } from "react-toastify";
const Services = () => {
    const [serviceList, setServiceList] = useState(null);
    const searchRef = useRef("");
    const [itemList, setItemList] = useState(null);
    const [networkCall, setNetworkCall] = useState(true);
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
                        if(item.servicePending[0]){
                          return item.servicePending.map((service)=><List><Service service={service} /></List>);
                        }
                        else{
                          return item.servicesHistory.map((service)=><List><Service item={item} service={service} /></List>);
                        }
                    }
                    ): <div className='text-lg'>No Service Found</div>):<ShimmerCategoryList title items={4} categoryStyle="STYLE_ONE" />
                    
                    }
                </div>
            </List>
        </Card>
    </div>
  )
}

export default Services