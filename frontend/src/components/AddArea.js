import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
function AddArea({areaData, setAreaData, fetchUserAreas}) {
  const [delay, setDelay] = useState(false);
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
    fetch('/items/addarea',{
      method:"POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: data
    }).then(res=>res.json())
    .then(data=>{
      if(data.status ==='SUCCESS'){
        console.log("data is recived")
        setDelay(false);
        navigate('/user');
        fetchUserAreas();
      }
    })
  }
  return (
    <div className="bg-zinc-700 h-full">
      <form class="max-w-sm mx-12 my-12">
  <div class="mb-5">
    <label htmlFor="area_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Area name</label>
    <input type="text" name="area" value={areaData.area} onChange={handelChange} id="area_name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter area name" required/>
  </div>
  <div class="mb-5">
    <label htmlFor="location" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
    <input type="text" name="area_location" value={areaData.area_location} onChange={handelChange} id="location" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter Location"/>
  </div>
  <button type='button' onClick={handleAddArea} disabled={delay} class="text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
</form>
    </div>
  );
}

export default AddArea;
