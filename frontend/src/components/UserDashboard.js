import React, { useEffect, useState } from "react";
import "./UserDashboard";
import Sidebar from "./Sidebar";
import DBNav from "./DBNav";
import { Routes, Route, matchPath,useNavigate } from "react-router-dom";
import Items from "./Items";
import VerifyOpt from "./VerifyOpt";
import AddArea from "./AddArea";
import AddItem from "./AddItem";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import ItemDetails from "./ItemDetails";
import AddMaintenance from "./AddMaintenance";

function User() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const navigae = useNavigate();
  const loadUserData = () => {
    console.log("making the request");
    setIsDataLoaded(true);
  };
  const [areaList, setAreaList] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedItem, setSelectedItem] = useState();
  const [areaData, setAreaData] = useState({
    area:"",
    area_location:""
  });
  const [itemList, setItemList]=useState(false);
  const [itemData, setItemData] = useState({
    item_name:"",
    serial_number:"",
    installation_date:"",
    area_id:"",
    img_file:null,
    generate_qr:false
  })
  const [userProfile, setUserProfile] = useState(false);
  const fetchUserProfile = async()=>{
    const reqdata = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    await fetch('api/user/getuserdata',reqdata)
    .then(res=>res.json())
    .then(data=>{
      console.log('data of dbnav is ready:',data)
      if(data.status == 'SUCCESS'){

        setUserProfile({
          name:data.user_data.user_name,
          email:data.user_data.user_email,
          profileimg:data.user_data.user_profile_url
        })
      }
    })
  }
  const fetchItemsByArea=async(selectedArea_by)=>{
    console.log("calling fetchItemsByArea() with selected area value as:",selectedArea,selectedArea_by);
    try{
      const options = {
        method:'POST',
        headers:{'content-type': 'application/json'},
        body:await JSON.stringify({area_id:selectedArea_by})
      }
      fetch('/items/getitems',options)
      .then(res=>res.json())
      .then(data=>{
        if(data.status =='SUCCESS'){
          setItemList(data.item_list);
          navigae('/user/items');
        }
      })
      // const response = await axios.post('http://localhost:5000/items/getitems',{
      //   Headers:{'content-type': 'application/json'},
      //   data:await JSON.stringify({area_id:selectedArea_by})
      // });
      // const res=response.data
      // console.log('response.data: ',res);
      // if(res.status==='SUCCESS'){
      //   setItemList({items:res.item_list});
      //   navigator('/user/items');
      // }
    }catch(err){
      toast.error("Error while Fetching itemList");
      navigator('/network_error');
    }
  }
  const fetchUserAreas = async () => {
    console.log("inside fetch area");
    fetch('/items/getareas',{
      method: "POST",
    }).then(res=>res.json())
    .then(data=>{
      if(data.status === 'SUCCESS'){
        console.log("inside fetch areas")
        setAreaList({areas:data.areasId});
      }
    })
    console.log("arealist: ", areaList);
  };
  

  
  useEffect(() => {
    
    fetchUserAreas();
  },[]);
  useEffect(()=>{
    fetchUserProfile();
    // console.log("fetchitmes by area is called by useEffect!")
    // fetchItemsByArea();
  },[])
  useEffect(() => {
    //callfetch funtion here...
  }, []);

  return (
    <div className="flex">
      <Sidebar
        areaList={areaList}
        selectedArea={selectedArea}
        setSelectedArea={setSelectedArea}
        fetchItemsByArea={fetchItemsByArea}
      />
      <div className="flex flex-col w-5/6 h-screen">
        <DBNav userProfile={userProfile} fetchUserProfile={fetchUserProfile}/>
        
        <Routes>
          {/* <Route path='/' element={<Layout/>}> */}
          <Route
            path="/items"
            element={<Items setItemList={setItemList} selectedArea={selectedArea} itemList={itemList} fetchItemsByArea={fetchItemsByArea} selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>}
          ></Route>
          <Route path="/addarea" element={<AddArea fetchUserAreas={fetchUserAreas} setAreaData={setAreaData} areaData={areaData} />}></Route>
          <Route path="/generateqr" element={<>This is qr</>}></Route>
          <Route path="/transaction" element={<>This is transaction</>}></Route>
          <Route path="/additem" element={<AddItem selectedArea={selectedArea} itemData={itemData} setItemData={setItemData} fetchItemsByArea={fetchItemsByArea}/>}></Route>
          <Route path="/item" element={<ItemDetails selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>}/>
          <Route path="item/addmaintenance" element={<AddMaintenance selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>} />
          <Route path="/item/:itemId" element={<ItemDetails selectedItem={selectedItem} setSelectedItem={setSelectedItem}/>}/>
          {/* </Route> */}
        </Routes>
      </div>
    </div>

    //   <Routes>
    //   <Route path='/' element={<Layout/>}>
    //     <Route path='items' element={<Items/>}></Route>
    //     <Route path='addarea' element={<AddArea/>}></Route>
    //     <Route path='generateqr' element={<>This is qr</>}></Route>
    //     <Route path='transaction' element={<>This is transaction</>}></Route>
    //   </Route>
    // </Routes>
  );
}

export default User;
