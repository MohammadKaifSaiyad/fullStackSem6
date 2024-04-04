import React,{useEffect, useState} from "react";
import { MdEdit } from "react-icons/md";
import { MdOutlineQrCode, MdOutlineArrowBack, MdDelete } from "react-icons/md";
import { useNavigate, useParams, useSearchParams} from "react-router-dom";
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
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { toast ,ToastContainer} from "react-toastify";
import axios from "axios";
import ServiceItem from "./ServiceItem";



function ItemDetails({ selectedItem, setSelectedItem, edit, setEdit, fetchItemsByArea, selectedService, setSelectedService}) {
  const [isQRAvailable, setIsQRAvailable] = useState(false);
  const [qrData, setQrData] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [itemIdByQr, setItemIdByQr] = useState(false); 
  const handleDownloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrData;
    link.download = `${selectedItem.name}_qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const fetchGenerateQRAPI = async()=>{
    const reqBody = {

      "area_id":selectedItem.area_id,
      "qrcode":selectedItem.qrCode,
    }
    console.log(`/items/generateqr/${selectedItem._id}`)
    await axios.get(`http://localhost:5000/items/generateqr/${selectedItem._id}`)
    .then(res=>res.data)
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
  const handleAddMaintenance =()=>{
    if(itemIdByQr){
      navigate('/user/item/addmaintenance');
    }else{
      navigate('addmaintenance');
    }
    
  }
  const handleGenerateQR = ()=>{
    console.log(selectedItem);
    // call generate Qr api
    fetchGenerateQRAPI();
  }

  const fetchItemDetails = async()=>{
    console.log('inside fetch item details', selectedItem);
    const options = {
      method:'POST',
      headers:{'content-type': 'application/json'},
      credentials:'include',
      body:await JSON.stringify({item_id:selectedItem ? selectedItem._id:null})
    }
    fetch('https://inventoflow.onrender.com/items/getitem',options)
    .then(res=>res.json())
    .then(data=>{
      if(data.status ==='SUCCESS'){
        setSelectedItem(data.item_detail)
        setServiceList(data.item_detail.servicePending);
        navigate('/user/item');
      }else{
        toast.error(data.message);
      }
    })
    .catch(err=>{
      toast.error('Error while retrieving item Details!')
    })
  }

  const fetchItemByQr =async ()=>{
    const option = {
      method:'POST',
      headers:{'content-type': 'application/json'},
      credentials:'include',
      body:await JSON.stringify({item_qr: params.itemId})
    }
    fetch('https://inventoflow.onrender.com/items/getitembyqr',option)
    .then(res=>res.json())
    .then(data=>{
      if(data.status === 'SUCCESS'){
        setSelectedItem(data.item_detail);
      }
      else{
        toast.error(data.message);
      }
    }).catch(err=>{
      toast.error('Error while fetching item Details!');
      console.log("error :", err)
    })
  }

  const checkParam = ()=>{
    if(params.itemId){
      console.log('By params:');
      setItemIdByQr(true);
      fetchItemByQr();
    }
  }
  const handleDeleteItem =async()=>{
    const isConfirmed = window.confirm(`Are you sure you want to delete ${selectedItem.name}?`);
    if (isConfirmed) {
      const data = { item_id: selectedItem._id, area_id: selectedItem.area };
      console.log('calling delete api:', data);
      const options = {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          credentials:'include',
          body: JSON.stringify(data)
      };
      fetch('https://inventoflow.onrender.com/items/deleteitem', options)
          .then(res => res.json())
          .then(data => {
              if (data.status === 'SUCCESS') {
                  toast.success('item Deleted!');
                  fetchItemsByArea(selectedItem.area);
                  navigate('/user/items');
              } else {
                  toast.error(data.message);
              }
          })
          .catch(err => {
              console.error('Error deleting item:', err);
              toast.error('Error while deleting item!');
          });
      }
  }
  const fetchHistory = async() => {
    const options = {
      method:'POST',
      headers:{'content-type': 'application/json'},
      credentials:'include',
      body:await JSON.stringify()
    }
    fetch('https://inventoflow.onrender.com/items/getservices', options)
    .then(res => res.json())
    .then(data =>{
      if(data.status = 'SUCCESS'){
        setServiceList();
      }else{
        toast.error(data.message);
      }
    })
  }
  useEffect(()=>{
    checkParam();
  },[])
  const [showHistory, setShowHistory] = useState(false);
  const [serviceList, setServiceList] = useState(selectedItem ? selectedItem.servicePending : null);
  
  const handleEditItemDetails = ()=>{
    setEdit(true);
    navigate('/user/additem');
  }
  const composeEmail = () => {
    window.location.href = `mailto:${selectedService.providerDetails.contactEmail}?subject=${encodeURIComponent("subject")}&body=${encodeURIComponent("body")}`;
  };
  const deleteService = async(serviceId) => {
    const body = {
      item_id: selectedItem._id,
      service_id: serviceId
    }
    const options = {
      method:'POST',
      headers:{'content-type': 'application/json'},
      credentials:'include',
      body:await JSON.stringify(body)
    }
    fetch('https://inventoflow.onrender.com/items/deleteservice', options)
    .then(res => res.json())
    .then(async data => {
      if(data.status === 'SUCCESS'){
        //fectch item details again();
        await fetchItemDetails();
        console.log('fectch item details again();');
      }else{
        toast.error(data.message);
      }
    })
  }
  function getSum(inti,part){
    return inti+part.partCost;
  }
  useEffect(()=>{
    fetchItemDetails();
  },[])
  return (
    <>
    
    <ToastContainer/>
    {
      qrData  &&
      <div className="fixed inset-0 flex flex-row items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="bg-white flex flex-col p-4 rounded-md shadow-md">
          <IoCloseOutline className='text-black self-end cursor-pointer size-6' onClick={()=>{setQrData(false)}}/>
          <div className="font-sans text-l my-2">QrCode</div>
          <div className="w-26 h-26"><img src={qrData}></img></div>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md self-end justify-end" onClick={handleDownloadQRCode}>
      download
    </button>
          </div>
      </div>
    }
    { selectedItem &&
    <div className="flex flex-row w-full">
      
      <div className="mt-20 w-3/6">
        <div className="font-sans text-2xl ml-4 ">Item Details</div>
        <div className="flex flex-row">
          <div className="font-sans text-xl ml-4 mt-3 w-5/6">
            Item information
          </div>
          <MdEdit className="mt-5 ml-20 w-5 h-5 hover:border-2 hover:border-gray-700 text-customeColor-400 cursor-pointer" onClick={handleEditItemDetails}/>
          <MdOutlineQrCode className="mt-5 ml-2 w-5 h-5 hover:border-2 hover:border-gray-700 text-customeColor-400 cursor-pointer" onClick={handleGenerateQR}/>
          <MdDelete className="mt-5 ml-2 w-5 border-r h-5 hover:border-2 hover:border-gray-700 text-customeColor-400 cursor-pointer" onClick={handleDeleteItem} />
        </div>
        <Card className="mt-2 ml-4 flex">
          <div className="flex flex-row mt-5">
            
            <div className="m-2 w-4/6">
              <div className="flex w-24">
                <div className="m-2">Name:</div>
                <div className="m-2">{selectedItem.name}</div>
              </div>
              <div className="flex">
                <div className="m-2">Serial Number:</div>
                <div className="m-2">{selectedItem.serialNumber}</div>
              </div>

              <div className="flex">
                <div className="m-2">Installation Date:</div>
                <div className="m-2">{selectedItem.installationDate}</div>
              </div>
              <div className="flex">
                <div className="m-2">qrCode:</div>
                <div className="m-2">{selectedItem.qrCode}</div>
              </div>
            </div>
            <Avatar
              variant="circular"
              alt="Item Image"
              src={selectedItem.imageUrl?selectedItem.imageUrl:require("./img/default-placeholder.png")}
              className="w-24 h-24 ml-10 mr-2 self-start mt-2"
            />
          </div>
          <button className="self-end px-2 h-8 text-white bg-customeColor-400 border-l rounded m-4" onClick={handleAddMaintenance}>
            Add Maintenance
          </button>
          <div class="flex justify-center">
            <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 w-11/12 content-center" />
          </div>
          <div className="flex">
          <MdOutlineArrowBack
            className="h-6 w-6 mx-4 mt-10 mb-6 cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          />
          
          </div>
        </Card>
      </div>
      <div className="w-3/6 m-5">
        <Card className=" overflow-hidden rounded shadow-lg m-auto mt-20">
          <div className="font-sans text-xl ml-4 my-4">Maintenance</div>
      
          <div class="sm:hidden">
            <label for="tabs" class="sr-only">
              Select your country
            </label>
            <select
              id="tabs"
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
                  setShowHistory(true)
                  console.log(selectedItem);
                  // fetchHistory();
                  setServiceList(selectedItem.servicesHistory);
                }}
              >
                History
              </a>
            </li>
            <li class="w-full focus-within:z-10">
              <a
                class="inline-block w-full cursor-pointer p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => {
                  setShowHistory(false);
                  setServiceList(selectedItem.servicePending);
                  // fetchHistory();
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
                {serviceList && serviceList.map((service, index) => (<ServiceItem key={service._id} service={service} showHistory={showHistory} deleteService={deleteService} setEdit={setEdit} selectedService={selectedService} setSelectedService={setSelectedService}/>))}
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
    }
    </>

  );
}

export default ItemDetails;
