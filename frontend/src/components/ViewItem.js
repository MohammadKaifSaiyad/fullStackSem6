import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ItemDetails from './ItemDetails';
import { toast, ToastContainer } from 'react-toastify'

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
    const params = useParams();
    const [itemData, setItemData] = useState(null);
    const fetchItemDetails = async()=>{
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
        }
        else{
          toast.error(data.message);
        }
      }).catch(err=>{
        toast.error('Error while fetching item Details!');
        console.log("error :", err)
      })
    }
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
          <button className="self-end px-2 h-8 text-white bg-gray-600 border-l rounded m-4">
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


    </>
  )
}

export default ViewItem;