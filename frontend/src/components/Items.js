import React, { useEffect, useRef, useState } from "react";
import Item from "./Item";
import { FaAngleDown } from "react-icons/fa";
import { MdQrCodeScanner } from "react-icons/md";
import { IoIosQrScanner } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
import {QrScanner} from '@yudiel/react-qr-scanner';
import QRCode from 'react-qr-code';
import QrReader from 'react-qr-scanner'
import {
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
} from "@material-tailwind/react";
import { toast ,ToastContainer} from "react-toastify";


function Items({selectedArea, fetchItemsByArea, itemList, selectedItem, setSelectedItem, setItemList}) {
  const searchRef = useRef();
  const navigate = useNavigate();
  const [qrCodeData, setQRCodeData] = useState('');
  const previewStyle = {
    height: 240,
    width: 320,
  }
  const [showQrReader, setShowQrReader]=useState(false);
  const handleAddItem = ()=>{
    navigate("/user/additem")
  }
  
  useEffect(()=>{
    console.log("Inside items List selectedArea: ",selectedArea)
  },[])
  const handleSearch =(e)=>{
    if(searchRef.current.value==''){
      fetchItemsByArea(selectedArea);
      return;
    }
    const url = `/items/search/${searchRef.current.value}`
    // console.log(url)
    const option = {
      method:"POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({"area_id":selectedArea})
    }
    fetch(url,option)
    .then(response=>response.json())
    .then(res=>{
      if(res.status==='SUCCESS'){
        setItemList(res.search_result);
      }else{
        toast.error(res.message);
      }
    }).catch(err=>{
      toast.error("Error while searching!");
    })
  }
  const handleScan =(data)=>{
    try{
      console.log(data)
    if(!data)
      return;
    else{
      toast.success('Qr is scann put it away from screen!')
      window.location.href=data
    }
    
    }catch(err){
      toast.error('Can scan the url!')
    }
  }
  return (
    <>
    <ToastContainer/>
    {
      showQrReader && <div className="fixed inset-0 flex flex-row items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        
      <div className="bg-white flex flex-col p-4 rounded-md shadow-md">
      <IoCloseOutline className='text-black self-end cursor-pointer size-6' onClick={()=>{setShowQrReader(false)}}/>
      <div className="font-sans text-l my-2">Scan QrCode</div>
      <div className="w-26 h-26">
      {/* <QrReader
          delay={{
            delay: 5000,
            result: 'No result',
          }
      }
          onError={()=>{console.log('error')}}
          onScan={(data)=>{handleScan(data)}}
          style={{
            height: 240,
            width: 320,
          }}
          /> */}
          <QrScanner
          onDecode={(result) =>{handleScan(result)}}
          onError={(error) => console.log(error?.message)}
          containerStyle={{height:240,width:320}}
      />
     </div>
        
      </div>
     </div>
      
    }
      {
        selectedArea?<div className="flex flex-row-reverse mt-16">
        <div className="w-2/6">
          <button className="px-2 h-8 text-white bg-gray-600 border-l rounded m-4" onClick={handleAddItem}>
            Add Item
          </button>
        </div>
  
        <div className="w-4/6">
          <Card className="">
            <div className="font-sans text-3xl ml-4">Item List</div>
            <div className="flex items-center">
              <div className="flex mx-4 my-8">
                <input
                  type="text"
                  className="block h-8 w-72 px-2 py-2  text-gray-700 bg-white border rounded-md focus:border-zinc-700 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="Search item..."
                  onChange={handleSearch}
                  ref={searchRef}
                />
                <button className="px-2 h-8 text-white bg-gray-600 border-l rounded ">
                  Search
                </button>
                
              </div>
              <IoIosQrScanner size='40' className="cursor-pointer" onClick={()=>{setShowQrReader(true)}}/>
              {/* <MdQrCodeScanner size='40'/> */}
            </div>
            <div className="overflow-hidden">
            <Card>
            <List className="overflow-y-scroll w-5/6 ">
              <div className="h-96">
                {
                itemList ? itemList.map((item) => (
                  <Item key={item._id} item={item} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
                )):<div>No Items to show.</div>
              
              }
              </div>
            </List>
            </Card>
            </div>
          </Card>
        </div>
      </div> : <h2>Select area first</h2>
      }
    </>
  );
}

export default Items;
