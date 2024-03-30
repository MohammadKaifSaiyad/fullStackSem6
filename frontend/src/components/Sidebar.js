// import React, { useEffect, useState } from "react";
// import { FaBox, FaPlus, FaQrcode, FaHistory, FaWarehouse } from "react-icons/fa";
// import { Link,useNavigate, NavLink } from "react-router-dom";




// function Sidebar({areaList, selectedArea, setSelectedArea, fetchItemsByArea}) {
//   const navigate = useNavigate();
  

//   const handleAreaChange=async(e)=>{
//     e.preventDefault();
//     await setSelectedArea(e.target.value);
//     console.log('selected area:',e.target.value, selectedArea)
//     await fetchItemsByArea(e.target.value);
//     navigate('/user/items');
//   }
//   return (
//     <div className="h-screen overflow-hidden bg-gray-500 w-1/6">
//       <div className="dashboard-logo flex flex-col  ">
//         <img
//           src={require("./img/logo-white-transparent.png")}
//           className="m-3 h-12 self-center justify-self-center cursor-pointer"
//           onClick={()=>{navigate("/")}}
//         />
//       </div>
//       <div className="flex flex-row overflow-auto bg-zinc-300 m-2 rounded-lg justify-items-center h-4/5">
//         <ul className="w-full">
//         <select
//           id="countries"
//           class="bg-slate-400 m-4 p-2 w-52 border border-gray-300 text-gray-900 text-base hover:bg-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//           onChange={handleAreaChange}
//           value={selectedArea}
//         >
//             <option selected value='none'><div className='text-xl'>Select Department</div></option>
//             {
//                areaList?areaList.areas.map(choose=>(<option value={choose._id}>{choose.name}</option>)):"Loading"
//             }
//           </select>
//           <NavLink to="addarea">
//             <div className="flex flex-row m-4 bg-slate-400  rounded-lg p-2 items-center hover:bg-slate-300 active:bg-cyan-300 shadow-lg shadow-cyan-500/50">
//               <FaWarehouse />
//               <li className="ml-1">Add Department</li>
//             </div>
//           </NavLink>
//           <NavLink to="items">
//             <div className="flex flex-row m-4 bg-slate-400 rounded-lg p-2 items-center hover:bg-slate-300 active:bg-cyan-300 shadow-lg shadow-cyan-500/50">
//               <FaBox />
//               <li className="ml-1">Items</li>
//             </div>
//           </NavLink>
          
//           <NavLink to="generateqr">
//             <div className="flex flex-row m-4 bg-slate-400 rounded-lg p-2 items-center hover:bg-slate-300 active:bg-cyan-300 shadow-lg shadow-cyan-500/50">
//               <FaQrcode />
//               <li className="ml-1">Generate QR</li>
//             </div>
//           </NavLink>
//           <NavLink to="services">
//             <div className="flex flex-row m-4 bg-slate-400 rounded-lg p-2 items-center hover:bg-slate-300 active:bg-cyan-300 shadow-lg shadow-cyan-500/50">
//               <FaHistory />
//               <li className="ml-1">Service History</li>
//             </div>
//           </NavLink>
//         </ul>
//         {/* <NavLink to='setting'><div className=''>Settings</div></NavLink> */}
//       </div>
//     </div>

//   );
// }

// export default Sidebar;













import React, { useEffect, useState } from "react";
import { FaBox, FaPlus, FaQrcode, FaHistory, FaWarehouse } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ areaList, selectedArea, setSelectedArea, fetchItemsByArea }) {
  const navigate = useNavigate();

  const handleAreaChange = async (e) => {
    e.preventDefault();
    await setSelectedArea(e.target.value);
    console.log('selected area:', e.target.value, selectedArea)
    await fetchItemsByArea(e.target.value);
    navigate('/user/items');
  }

  return (
    <div className="h-screen overflow-hidden bg-customeColor-300 w-1/6">
      <div className="dashboard-logo flex flex-col">
        <img
          src={require("./img/logo-white-transparent.png")}
          className="m-3 h-12 self-center justify-self-center cursor-pointer"
          onClick={() => { navigate("/") }}
        />
      </div>
      <div className="flex flex-row overflow-auto bg-customeColor-100 m-2 rounded-lg justify-items-center h-4/5">
        <ul className="w-full">
          <select
            id="countries"
            className="bg-customeColor-300 m-4 p-2 w-52 border border-gray-300 text-white text-base hover:bg-customeColor-200 rounded-lg focus:ring-customeColor-400 focus:border-customeColor-400 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleAreaChange}
            value={selectedArea}
          >
            <option value='none'><div className='text-xl'>Select Department</div></option>
            {
              areaList ? areaList.areas.map(choose => (<option key={choose._id} value={choose._id}>{choose.name}</option>)) : "Loading"
            }
          </select>
          <NavLink to="addarea">
            <div className="flex flex-row m-4 bg-customeColor-300 rounded-lg p-2 items-center hover:bg-customeColor-200 active:bg-customeColor-200 transition-colors duration-300">
              <FaWarehouse className="text-white"/>
              <li className="ml-1 text-white">Add Department</li>
            </div>
          </NavLink>
          <NavLink to="items">
            <div className="flex flex-row m-4 bg-customeColor-300 rounded-lg p-2 items-center hover:bg-customeColor-200 active:bg-customeColor-200 transition-colors duration-300">
              <FaBox className="text-white"/>
              <li className="ml-1 text-white">Items</li>
            </div>
          </NavLink>
          <NavLink to="generateqr">
            <div className="flex flex-row m-4 bg-customeColor-300 rounded-lg p-2 items-center hover:bg-customeColor-200 active:bg-customeColor-200 transition-colors duration-300">
              <FaQrcode className="text-white"/>
              <li className="ml-1 text-white">Generate QR</li>
            </div>
          </NavLink>
          <NavLink to="services">
            <div className="flex flex-row m-4 bg-customeColor-300 rounded-lg p-2 items-center hover:bg-customeColor-200 active:bg-customeColor-200 transition-colors duration-300">
              <FaHistory className="text-white"/>
              <li className="ml-1 text-white">Service History</li>
            </div>
          </NavLink>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
