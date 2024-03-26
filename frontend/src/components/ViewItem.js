import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../Context';
import { useParams, useNavigate } from 'react-router-dom'
import ItemDetails from './ItemDetails';
import { toast, ToastContainer } from 'react-toastify'
import ServiceItem from './ServiceItem';
import {IoCloseOutline} from 'react-icons/io5'

import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
  Button,
} from "@material-tailwind/react";

function ViewItem() {
  const [serviceList, setServiceList] = useState();
  const [selectedService, setSelectedService] = useState(false);
    const params = useParams();
    const [itemData, setItemData] = useState(null);
    const {viewOnlyState} = useContext(Context);
    const [viewOnly, setViewOnly] = viewOnlyState;
    const navigate = useNavigate();
    const fetchItemDetails = async()=>{
      setViewOnly(true);
      const option = {
        method:'POST',
        headers:{'content-type': 'application/json'},
        body:await JSON.stringify({item_qr: params.itemId})
      }
      fetch('/items/getitemforview',option)
      .then(res=>res.json())
      .then(data=>{
        if(data.status === 'SUCCESS'){
          setItemData(data.item_detail);
          setServiceList(data.item_detail.servicePending);
        }
        else{
          toast.error(data.message);
        }
      }).catch(err=>{
        toast.error('Error while fetching item Details!');
        console.log("error :", err)
      })
    }
    function getSum(inti,part){
      return inti+part.partCost;
    }
    const composeEmail = () => {
      window.location.href = `mailto:${selectedService.providerDetails.contactEmail}?subject=${encodeURIComponent("subject")}&body=${encodeURIComponent("body")}`;
    };
    useEffect(()=>{
        console.log('item Id:',params.itemId);
        // call fetch data to get item data
        fetchItemDetails();
    },[])
  return (
    <>
    <ToastContainer/>
      <div className="flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row w-full">
      <div className="mt-20 md:w-3/6 md:mr-1 w-100 mr-5 items-center">
        <div className="font-sans text-2xl ml-4 ">Item Details</div>
        <div className="flex flex-row">
          <div className="font-sans text-xl ml-4 mt-3 w-5/6">
            Item information
          </div>
          
        </div>
        <Card className="mt-2 ml-4 flex ">
          <div className="flex flex-row mt-5">
            
            <div className="m-2 w-4/6">
              <div className="flex w-24">
                <div className="m-2">Name:</div>
                <div className="m-2">{itemData&&itemData.name}</div>
              </div>
              <div className="flex">
                <div className="m-2">Serial Number:</div>
                <div className="m-2">{itemData&&itemData.serialNumber}</div>
              </div>

              <div className="flex">
                <div className="m-2">Installation Date:</div>
                <div className="m-2">{itemData&&itemData.installationDate}</div>
              </div>
              <div className="flex">
                <div className="m-2">qrCode:</div>
                <div className="m-2">{itemData&&itemData.qrCode}</div>
              </div>
            </div>
            <Avatar
              variant="circular"
              alt="Item Image"
              src={(itemData&&itemData.imageUrl) ? itemData.imageUrl : require("./img/default-placeholder.png")}
              className="w-24 h-24 ml-10 mr-2 self-start mt-2"
            />
          </div>
          <div class="flex justify-center">
            <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 w-11/12 content-center" />
          </div>
          <div className="flex">
          <button className="self-end px-2 h-8 text-white bg-gray-600 border-l rounded m-4" onClick={()=>{navigate("/signin")}}>
            Signin
          </button>
          
          </div>
        </Card>
      </div>
      <div className="md:w-3/6 w-5/6 m-5">
        <Card className="overflow-y-scroll rounded shadow-lg m-auto mt-20">
          <div className="font-sans text-xl ml-4 my-4">Maintenance</div>

          <div class="sm:hidden">
            <label for="tabs" class="sr-only">
              Select your country
            </label>
            <select
              id="tabs"
              onChange={(e) => {
                console.log(e.target.value);
              }}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="history">History</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <ul class="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
            <li class="w-full focus-within:z-10">
              <a
                class="inline-block cursor-pointer w-full p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => {
                  console.log("history", itemData.servicesHistory);
                  setServiceList(itemData.servicesHistory);
                }}
              >
                History
              </a>
            </li>
            <li class="w-full focus-within:z-10">
              <a
                class="inline-block w-full cursor-pointer p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => {
                  console.log("pending", itemData.servicePending);
                  setServiceList(itemData.servicePending);
                }}
              >
                Pending
              </a>
            </li>
          </ul>
          
          <List className="h-96 overflow-y-scroll">
          {
            serviceList?
            <div>
                {serviceList && serviceList.map((service, index) => (<ServiceItem key={service._id} service={service} showHistory={true} deleteService={null} setEdit={null} selectedService={selectedService} setSelectedService={setSelectedService}/>))}
            </div>
            : "no service History"
          }</List>

        </Card>
      </div>
      {
       selectedService ? (
        <div className="fixed inset-0 flex flex-row items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          
  <div className="bg-white flex flex-col p-2 rounded-md shadow-md">
  <IoCloseOutline className='text-black self-end cursor-pointer size-7' onClick={()=>{setSelectedService(false)}}/>
    <div className="ml-2 text-xl">Service Details</div>
    <div className='flex flex-row p-2 items-center'>
      <div className='flex flex-col justify-center ms-2'>
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
        <div className="ml-4">Total cost: {selectedService.parts.reduce(getSum,0)}</div>
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


    </>
  )
}

export default ViewItem;