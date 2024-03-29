import React, { useEffect, useRef, useState } from "react";
import Item from "./Item";
import { useNavigate } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";
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
  return (
    <div className="w-full h-5/6">
      <ToastContainer/>
      {
        selectedArea?
        <div className="flex flex-row mt-16 w-100 h-full">
          <div className="flex flex-col w-4/6">
            <Card className="w-100 h-full">
              <div className="font-sans text-3xl w-100 ml-4">Item List</div>
              <div className="flex items-center w-100">
                <input
                  type="text"
                  className="block h-8 px-2 py-2 mx-4 my-8 flex-grow  text-gray-700 bg-white border rounded-md focus:border-zinc-700 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="Search item..."
                  onChange={handleSearch}
                  ref={searchRef}
                />
              </div>
              <Card className="h-full">
                <List className="overflow-y-scroll">
                  <div className="">
                    {
                      itemList ? itemList.map((item) => (
                        <Item key={item._id} item={item} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
                      )):<div className="">No Items to show.</div>
                    }
                  </div>
                </List>
              </Card>
            </Card>
          </div>
          <div className="w-2/6">
            <button className="px-2 h-8 text-white bg-gray-600 border-l rounded m-4" onClick={handleAddItem}>
              Add Item
            </button>
          </div>
        </div> : <div className="text-2xl m-5">Select area first</div>
      }
    </div>
  );
}

export default Items;
