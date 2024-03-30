import React,{useEffect, useRef, useState} from 'react'
import { ToastContainer, toast } from "react-toastify";
import {IoCloseOutline} from 'react-icons/io5'
import {
    List,
    Card,
  } from "@material-tailwind/react";
import GenerateQRItem from "./GenerateQRItem";
import {ShimmerCategoryList} from "react-shimmer-effects";
const GenerateQRList=({fetchItemsByArea, setSelectedArea, setSelectedItemFromP})=> {
  const [qrData, setQrData] = useState(false);
  const [isQRAvailable, setIsQRAvailable] = useState(false);
    const [itemList, setItemList] = useState(["",""]);
    const [selectedItem, setSelectedItem] = useState();
    const searchRef = useRef();
    const handleDownloadQRCode = () => {
      const link = document.createElement('a');
      link.href = qrData;
      link.download = `${selectedItem.name}_qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    const fetchAllItems = ()=>{
      const option = {
        method:'POST',
        headers:{'content-type': 'application/json'},
      }
      fetch('/items/getallitems',option)
      .then(res=>res.json())
      .then(data=>{
        if(data.status==='SUCCESS'){
          setItemList(data.item_list);
        }
      })
      .catch(err=>{
        toast.error('fetching items!')
        console.log('error', err);
      })
    }
    const handleSearch =(e)=>{
        if(searchRef.current.value==''){
          fetchAllItems();
          return;
        }
        const url = `/items/search/${searchRef.current.value}`
        // console.log(url)
        const option = {
          method:"POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({type:"byUserId"})
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
      useEffect(()=>{fetchAllItems()},[])
  return (
    <div className='h-full flex flex-col w-full'>
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
      <div className='h-10 flex-none font-sans text-2xl ml-5 mt-5 '>All item List</div>
      <div className="flex-none mx-4 my-8 h-10 w-5/6">
          <input
              type="text"
              className="block h-8 w-72 px-2 py-2  text-gray-700 w-full bg-white border rounded-md focus:border-zinc-700 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Search item..."
              onChange={handleSearch}
              ref={searchRef}
          />
      </div>
      <Card className='grow h-4/6'>
        <List className="overflow-y-scroll ">
          <div className="">
            {
              itemList ? itemList.map((item) => (
                <GenerateQRItem key={item._id} fetchItemsByArea={fetchItemsByArea} qrData={qrData} setQrData={setQrData} isQRAvailable={isQRAvailable} setIsQRAvailable={setIsQRAvailable} item={item} setSelectedItem={setSelectedItem} selectedItem={selectedItem} setSelectedArea={setSelectedArea} setSelectedItemFromP={setSelectedItemFromP}/>
              )):<ShimmerCategoryList title items={4} categoryStyle="STYLE_ONE" />
            
            }
          </div>
        </List>
      </Card>
    </div>
  )
}

export default GenerateQRList