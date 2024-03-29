import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { IoCloseOutline, IoNotificationsCircleOutline } from "react-icons/io5";
import './DBNav.css';
import { useNavigate } from 'react-router-dom';
// import { options } from '../../../backend/api/items';
// import CloseButton from 'react-bootstrap/CloseButton';
// import { CCloseButton } from '@coreui/react'
import {
  List,
} from "@material-tailwind/react";
import Notification from './Notification';

function DBNav({fetchUserProfile, userProfile}) {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState(null);
  
  const handleImageClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const handleShowNotification = ()=>{
    setShowNotification(true);
  }
  const handleLogout = () => {
    console.log('call api and delete cookies');
    const reqdata = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    fetch('/api/user/logout',reqdata)
    .then((res) => res.json())
    .then(async (data) => {
      console.log(data);
      if(data.status==='SUCCESS'){
        navigate("/signin");
      }else{
        console.log('logout failed')
      }
      
    });
  };
  const fetchNotification = ()=>{
    const reqdata = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    fetch('/items/getnotifications', reqdata)
    .then(res=>res.json())
    .then(data=>{
      if(data.status === 'SUCCESS'){
        setNotifications(data.notifications[0]?data.notifications:null);
        // console.log('setNotifiations: ', data.notifications)
        // console.log("data: ",data);
      }
    })
  }
  useEffect(()=>{
    fetchNotification();
  },[]);
  
  return (
    <div className='db-nav'>
      <div className='nav-text'>Dashboard</div>
      <div className='nav-bell'>
        <FaBell onClick={handleShowNotification} color={notifications? "red":"white"}/>
      </div>
      <div className='user-profile'>
        <img src={userProfile.profileimg ?  userProfile.profileimg:require('./img/user_profile_default.webp')} className='profile-img' alt='Profile' onClick={handleImageClick}/>
      </div>
      {
       isDialogOpen ? (
        <div className="fixed inset-0 flex flex-row items-center justify-center bg-gray-800 bg-opacity-75 z-50">
  <div className="bg-white flex flex-col p-8 rounded-md shadow-md">
    <div className='flex flex-row items-center'>
      <img src={userProfile.profileimg ? userProfile.profileimg : require('./img/user_profile_default.webp')} className='border-2 border-indigo-600 rounded-full w-52 h-52 mb-4 self-center justify-self-center'/>
      <div className='flex flex-col justify-center ms-2'>
        <p className='text-black m-2'>name: {userProfile.name}</p>
        <p className='text-black m-2'>email: {userProfile.email}</p>
      </div>
    </div>
    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md self-end justify-end" onClick={handleCloseDialog}>
      Close
    </button>
  </div>
</div>
      ): <></>
      }
      {
      showNotification ? (
       <div className="fixed inset-0 flex flex-row items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        
 <div className="bg-white flex flex-col p-4 rounded-md shadow-md">
 <IoCloseOutline className='text-black self-end cursor-pointer size-8' onClick={()=>{setShowNotification(false)}}/>
  
   <div className='p-4 flex flex-col'>
   {
      notifications? notifications.map(notif=><List><Notification fetchNotification={fetchNotification} notif={notif}/></List>):
      <div className='text-black'>No New Notification</div>
   }
   </div>
   
 </div>
</div>
     ): <></>
     }
      <div className='nav-logout-btn' onClick={handleLogout}>
        Logout
      </div>
    </div>
    
    
  );
}

export default DBNav;
