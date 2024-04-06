import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import { MdEdit, MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemPrefix,
  Card,
} from "@material-tailwind/react";
function AddArea({areaList, areaData, setAreaData, fetchUserAreas}) {
  const [delay, setDelay] = useState(false);
  const [editArea, setEditArea] = useState(false);
  const [edit, setEdit] = useState(false);
  const navigate = useNavigate();

  // const [areaData, setAreaData] = useState({
  //   area:"",
  //   area_location:""
  // });
  const handelChange =(e)=>{
    setAreaData(data=>({...data, [e.target.name]:e.target.value}))
  }
  const handleAddArea = async(e)=>{
    e.preventDefault();
    setDelay(true);
    console.log("inside add area call",areaData);
    const data = await JSON.stringify(areaData);
    console.log("area as json:",data);
    fetch('https://inventoflow.onrender.com/items/addarea',{
      method:"POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      credentials:'include',
      body: data
    }).then(res=>res.json())
    .then(data=>{
      if(data.status ==='SUCCESS'){
        console.log("data is recived")
        setAreaData({
          area:"",
          area_location:""
        })
        navigate('/user');
        fetchUserAreas();
      }else{
        toast.error(data.message);
      }
      setDelay(false);
    })
    .catch(err=>{
      toast.error('Error while adding area!');
      console.error('error: ', err);
      setDelay(false);
    })
  }
  const handleDeleteArea = async(area)=>{
    console.log("area: ",area);
    const confirm = `Are you sure that you want to delete department: ${area.name} which contains ${area.items?area.items.length: 0 } items`;
    const resOfConfirm = window.confirm(confirm);
    if(resOfConfirm){
      const reqBody = {
        method:'POST',
        headers:{'content-type': 'application/json'},
        credentials:'include',
        body:await JSON.stringify({area_id:area._id})
      }
      fetch('https://inventoflow.onrender.com/items/deletearea',reqBody)
      .then(res=>res.json())
      .then(data=>{
        if(data.status === 'SUCCESS'){
          navigate("/user/addarea")
          fetchUserAreas();
        }else{
          toast.error(data.message);
        }
      })
      .catch(err=>{
        console.error("Error:",err)
        toast.error("Error while deleting department");
      })
    }
  }
  const handleEditArea = ()=>{
    setEditArea(!editArea);
    setAreaData({
      area:"",
      area_location:""
    })
    // setEdit(!edit);
  }
  const handleAreaEdit=(area)=>{
    const areaObj = {
      area_id:area._id,
      area: area.name,
      area_location: area.location
    }
    // setEditArea(false);
    setEdit(true);
    setAreaData(areaObj);
  }
  return (
    <div className="bg-white h-full flex flex-row w-full">
      <ToastContainer/>
      <dvi className="w-3/6">
        <form class="max-w-sm mx-12 my-12">
          <div class="mb-5">
            <label htmlFor="area_name" class="block mb-2 text-lg font-medium font-sams text-gray-900 dark:text-white">Department Name</label>
            <input type="text" name="area" disabled={false} value={areaData.area} onChange={handelChange} id="area_name" class="bg-gray-50 font-sans border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-customeColor-400 focus:border-customeColor-400 block w-full p-2.5 dark:bg-gray-700 dark:border-customeColor-400 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Department Name" required/>
          </div>
          <div class="mb-5">
            <label htmlFor="location" class="block mb-2 text-lg font-medium text-gray-900 font-sans   dark:text-white">Location</label>
            <input type="text" name="area_location" disabled={false} value={areaData.area_location} onChange={handelChange} id="location" class="bg-gray-50 font-sans border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Department Location"/>
          </div>
          <button type='button' onClick={handleAddArea} disabled={delay || !(areaData.name!='')} class="text-white bg-customeColor-300 hover:bg-blue-800 focus:ring-4 font-sans focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{edit?"Edit":"Add"}</button>
        </form>
      </dvi>
      <div className="w-3/6 flex flex-col p-10">
        <button onClick={handleEditArea} className="text-white self-center justiry-self-center bg-customeColor-300 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg font-sans text-md h-10 sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{editArea? "Enable Add Department": "Edit Department"}</button>
        {
          editArea && 
          <div className="flex mt-5 bg-customeColor-300 flex-col border-2 rounded-lg border-customeColor-100">
            <div className="text-xl m-2 font-serif">Department List</div>
            <List className="bg-customeColor-100 m-2 border-2 rounded-lg border-customeColor-400">
              {
                areaList?areaList.areas.map(area=><div className="flex"><ListItem className="m-1 p-1 w-full flex flex-row"> <ListItemPrefix className="w-2/6 text-lg text-sans">{area.name}</ListItemPrefix> <div className="w-3/6 text-md text-sans">Location : {area.location}</div></ListItem> <MdEdit size={25} className="self-center mx-0.5 cursor-pointer hover:border-2 hover:border-gray-700 hover:rounded-md" onClick={()=>{handleAreaEdit(area)}}/> <MdDelete onClick={()=>{handleDeleteArea(area)}} size={25} className="mx-0.5 self-center cursor-pointer hover:border-2 hover:border-gray-700 hover:rounded-md"/></div>)
                :null
              }
            </List>
          </div>
        }
      </div>
    </div>
  );
}

export default AddArea;
