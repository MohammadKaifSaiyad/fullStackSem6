import React,{useRef, useState} from 'react'
import { ToastContainer, toast } from "react-toastify";
import {
    List,
    Card,
  } from "@material-tailwind/react";
import GenerateQRItem from "./GenerateQRItem";
const GenerateQRList=()=> {
    const [itemList, setItemList] = useState(["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""]);
    const [selectedItem, setSelectedItem] = useState();
    const searchRef = useRef();
    const fetchAllItems = ()=>{

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
  return (
    <div className='h-screen flex flex-col'>
        <div className='h-10 flex-none'>All items</div>
        <div className="flex-none mx-4 my-8 h-10">
            <input
                type="text"
                className="block h-8 w-72 px-2 py-2  text-gray-700 bg-white border rounded-md focus:border-zinc-700 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                placeholder="Search item..."
                onChange={handleSearch}
                ref={searchRef}
            />
        </div>
        <Card className='grow'>
            <List className="overflow-y-scroll ">
              <div className="">
                {
                itemList ? itemList.map((item) => (
                  <GenerateQRItem key={item._id} item={item} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>
                )):<div>No Items to show.</div>
              
              }
              </div>
            </List>
            </Card>
    </div>
  )
}

export default GenerateQRList