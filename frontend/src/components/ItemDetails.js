import React,{useEffect, useState} from "react";
import { MdEdit } from "react-icons/md";
import { MdOutlineQrCode, MdOutlineArrowBack, MdDelete } from "react-icons/md";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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



function ItemDetails({ selectedItem, setSelectedItem}) {
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
    navigate('addmaintenance');
  }
  const handleGenerateQR = ()=>{
    console.log(selectedItem);
    // call generate Qr api
    fetchGenerateQRAPI();
  }

  const fetchItemByQr =async ()=>{
    const option = {
      method:'POST',
      headers:{'content-type': 'application/json'},
      body:await JSON.stringify({item_qr: params.itemId})
    }
    fetch('/items/getitembyqr',option)
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

  useEffect(()=>{
    checkParam();
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
          <MdEdit className="mt-5 ml-20 w-5 h-5 hover:border-2 hover:border-gray-700 cursor-pointerr" />
          <MdOutlineQrCode className="mt-5 ml-2 w-5 h-5 hover:border-2 hover:border-gray-700 cursor-pointer" onClick={handleGenerateQR}/>
          <MdDelete className="mt-5 ml-2 w-5 border-r h-5 hover:border-2 hover:border-gray-700 cursor-pointer" />
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
          <button className="self-end px-2 h-8 text-white bg-gray-600 border-l rounded m-4" onClick={handleAddMaintenance}>
            Add Maintenance
          </button>
          <div class="flex justify-center">
            <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700 w-11/12 content-center" />
          </div>
          <div className="flex">
          <MdOutlineArrowBack
            className="h-6 w-6 mx-4 mt-10 mb-6"
            onClick={() => {
              navigate(-1);
            }}
          />
          
          </div>
        </Card>
      </div>
      <div className="w-3/6 m-5">
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
                  console.log("history");
                }}
              >
                History
              </a>
            </li>
            <li class="w-full focus-within:z-10">
              <a
                class="inline-block w-full cursor-pointer p-4 bg-white border-r border-gray-200 dark:border-gray-700 hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                onClick={() => {
                  console.log("pending");
                }}
              >
                Pending
              </a>
            </li>
          </ul>
          <div>history</div>
        </Card>
      </div>
    </div>
    }
    </>

  );
}

export default ItemDetails;
