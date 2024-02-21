import React, { useState, useEffect} from "react";
import Sidebar from "./Sidebar";
import DBNav from "./DBNav";
import { Outlet } from "react-router-dom";
import "./UserDashboard";
import { Routes, Route, matchPath } from "react-router-dom";
import Items from "./Items";
import VerifyOpt from "./VerifyOpt";
import AddArea from "./AddArea";


const demoChoose = {
  status: 'SUCCESS',
  areasId: [{
    _id:'9299292929',
    name:'area1'
  },{
    _id:'38383',
    name:'area2'
  },{
    _id:'9299dddd',
    name:'area2'
  }],
}
function Layout() {
  const [areaList, setAreaList] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const fetchUserAreas=async()=>{
    setAreaList({areas:demoChoose.areasId})
    console.log('arealist: ',areaList)
  }
  useEffect(()=>{
    fetchUserAreas();
  },[]);
  return (
    <>
      <DBNav />
      <div className="flex">
        <Sidebar areaList={areaList} selectedArea={selectedArea} setSelectedArea={setSelectedArea}/>
        <Routes>
      <Route path='/' element={<Layout/>}>
        <Route path='items' element={<Items/>}></Route>
        <Route path='addarea' element={<AddArea/>}></Route>
        <Route path='generateqr' element={<>This is qr</>}></Route>
        <Route path='transaction' element={<>This is transaction</>}></Route>
      </Route>
    </Routes>
      </div>
    </>
  );
}

export default Layout;
