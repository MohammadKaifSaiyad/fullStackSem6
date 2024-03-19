import React, { useEffect, useState } from "react";
import { FaBox, FaPlus, FaQrcode, FaHistory, FaWarehouse } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";




function Sidebar({areaList, selectedArea, setSelectedArea, fetchItemsByArea}) {
  const navigate = useNavigate();
  

  const handleAreaChange=async(e)=>{
    e.preventDefault();
    await setSelectedArea(e.target.value);
    console.log('selected area:',e.target.value, selectedArea)
    await fetchItemsByArea(e.target.value);
    navigate('/user/items');
  }
  return (
    <div className="h-screen overflow-hidden bg-gray-500 w-1/6">
      <div className="dashboard-logo">
        <img
          src={require("./img/logo-white-transparent.png")}
          className="w-40 m-3"
        />
      </div>
      <div className="flex flex-row overflow-auto bg-zinc-300 m-1 h-4/5">
        <ul>
        {/* <FaPlaceOfWorship/>select area */}
        <select
          id="countries"
          class="bg-slate-400 m-4 border border-gray-300 text-gray-900 text-base hover:bg-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-48 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={handleAreaChange}
        >
            <option selected value='none'><div className='text-xl'>Select Department</div></option>
            {
               areaList?areaList.areas.map(choose=>(<option value={choose._id}>{choose.name}</option>)):"Loading"
            }
          </select>
          <Link to="addarea">
            <div className="flex flex-row m-4 bg-slate-400 rounded-lg p-2 items-center hover:bg-slate-300 active:bg-cyan-300 shadow-lg shadow-cyan-500/50">
              <FaWarehouse />
              <li className="ml-1">Add Department</li>
            </div>
          </Link>
          <Link to="items">
            <div className="flex flex-row m-4 bg-slate-400 rounded-lg p-2 items-center hover:bg-slate-300 active:bg-cyan-300 shadow-lg shadow-cyan-500/50">
              <FaBox />
              <li className="ml-1">Items</li>
            </div>
          </Link>
          
          <Link to="generateqr">
            <div className="flex flex-row m-4 bg-slate-400 rounded-lg p-2 items-center hover:bg-slate-300 active:bg-cyan-300 shadow-lg shadow-cyan-500/50">
              <FaQrcode />
              <li className="ml-1">Generate QR</li>
            </div>
          </Link>
          <Link to="itemservice">
            <div className="flex flex-row m-4 bg-slate-400 rounded-lg p-2 items-center hover:bg-slate-300 active:bg-cyan-300 shadow-lg shadow-cyan-500/50">
              <FaHistory />
              <li className="ml-1">Service History</li>
            </div>
          </Link>
        </ul>
        {/* <Link to='setting'><div className=''>Settings</div></Link> */}
      </div>
    </div>

  );
}

export default Sidebar;
