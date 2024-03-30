import React, { useState, useRef, useEffect} from "react";
import { toast ,ToastContainer} from "react-toastify";
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';
import axios from "axios";
const crypto = require('crypto-js');

// Generate a random boundary string
// const boundary = `----${crypto.random(16).toString('hex')}`;
function AddItem({itemData, setItemData, selectedArea, fetchItemsByArea, setSelectedItem, selectedItem, edit, setEdit}) {
  const navigate = useNavigate();
  const [delay, setDelay] = useState(false);
  const imgRef = useRef(null);
  const [update, setUpdate] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleChange=(e)=>{
    if(e.target.type ==="checkbox"){
      setItemData(previous=>({...previous, [e.target.name]:!previous.generate_qr}))
    }
    else
    setItemData(previous=>({...previous,[e.target.name]:e.target.value}));
  }
  const checkItemData = ()=>{
    if(!selectedArea){
      toast.error("select area first");
      return 1;
    }
    itemData.area_id = selectedArea;
    console.log("inside check fun():",itemData);
    const todayDate = new Date().toISOString().slice(0, 10);
    if(itemData.installation_date > todayDate){
      toast.error("future date is entered")
      return 1;
    }
    return 0;
  }
  const compressImage = async (imageFile) => {
    const options = {
      maxSizeMB: 2,          // Max size in megabytes
      maxWidthOrHeight: 800, // Max width or height
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      console.log('compressedFile:',compressedFile)
      setSelectedImage(compressedFile);
      await setItemData(previous=>({...previous, img_file: compressedFile}))
      return compressedFile;
    } catch (error) {
      throw error;
    }
  };
  const handleFileChange = async(e)=>{
    console.log('item image file:',e.target.files[0])
    await compressImage(e.target.files[0]);
    // setItemData((prev)=>({...prev, img_file:e.target.files[0]}))
  }
  const handleUpdateItem = async(e)=>{
    e.preventDefault();
    if(checkItemData() === 1)
      return;
    console.log('handle update item is call', itemData);
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('image_url', selectedItem.imageUrl?selectedItem.imageUrl:null);
    formData.append('item_name', itemData.item_name);
    formData.append('item_id', selectedItem._id);
    formData.append('serial_number', itemData.serial_number);
    formData.append('installation_date', itemData.installation_date);
    formData.append('generate_qr', itemData.generate_qr);
    formData.append('area_id',selectedArea);
    try{
      await axios.post('http://localhost:5000/api/user/additem', formData, {})
      .then(res=>res.data)
      .then(data=>{
        if(data.status==='SUCCESS'){
          fetchItemsByArea(selectedArea);
          setItemData({
          item_name:"",
          serial_number:"",
          installation_date:"",
          area_id:"",
          img_file:null,
          generate_qr:false
        })
        setUpdate(false);
        navigate('/user/items');
        }else{
          toast.error(data.message);
        }
      })
    }catch(err){
      console.log(err);
      toast.error('Update failed!')
    }
  }
  const handleAddItem = async(e)=>{
    e.preventDefault();
    setDelay(true);
    if(checkItemData() === 1)
      return;
    console.log('selectedImage:',selectedImage)
    setItemData(previous=>({...previous, area_id:selectedArea}))
    // setItemData(async previous=>({...previous, img_file: await selectedImage}))
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('item_name', itemData.item_name);
    formData.append('serial_number', itemData.serial_number);
    formData.append('installation_date', itemData.installation_date);
    formData.append('generate_qr', itemData.generate_qr);
    formData.append('area_id',selectedArea);
    console.log("selectedImage in from",selectedImage);
    const data = await JSON.stringify(itemData);
    console.log('values of item:',itemData,itemData.img_file);
    // console.log('body data:',data);
    console.log('body before request:', data);
    try{
      // await axios.post('http://localhost:5000/api/user/additem',formData,{
      await axios.post('https://inventoflow.onrender.com/api/user/additem', formData, {
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
    }).then(res => res.data)
    .then(async result=>{
      if(result.status === 'SUCCESS'){
        await fetchItemsByArea(selectedArea);
        setItemData({
          item_name:"",
          serial_number:"",
          installation_date:"",
          area_id:"",
          img_file:null,
          generate_qr:false
        })
        navigate('/user/items');
      }else{
        toast.error(result.message);
      }
      setDelay(false)
    })
    .catch(err => {
      console.log('error while additem', err);
      setDelay(false)
    });
    }catch(err){
      console.log(err);
    }
    
  }
  const fillTheFields=()=>{
    const fillData = {
      item_name:selectedItem.name,
      serial_number:selectedItem.serialNumber,
      installation_date:selectedItem.installationDate,
      area_id:selectedItem.area,
      img_file:selectedItem.imageUrl,
      generate_qr:selectedItem.qrCode && true
    }
    setUpdate(true);
    setItemData(fillData);
  }
  useEffect(()=>{
    console.log(selectedItem);
    if(edit){
      fillTheFields();
    }
    else{
      setItemData({
        item_name:'',
      serial_number:'',
      installation_date:'',
      area_id:'',
      img_file:'',
      generate_qr:''
      })
    }
    return () => {
      setItemData({
        item_name: '',
        serial_number: '',
        installation_date: '',
        area_id: '',
        img_file: '',
        generate_qr: false
      });
      setEdit(false);
    };
  },[])
  return (
    <div className="bg-customeColor-200 h-full">
      <ToastContainer/>
      <form class="mx-12 my-12" onSubmit={update? handleUpdateItem : handleAddItem} encType='multipart/form-data'>
        <div className="flex">
          <div class="mb-5 mr-20 w-80">
            <label
              htmlFor="item_name"
              class="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
            >
              Item name
            </label>
            <input
              type="text"
              id="item_name"
              name="item_name"
              value={itemData.item_name}
              onChange={handleChange}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter area name"
              required
            />
          </div>
          <div class="mb-5 ml-20 w-80">
            <label
              htmlFor="serial_number"
              class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Serial number
            </label>
            <input
              type="text"
              id="serial_number"
              name="serial_number"
              onChange={handleChange}
              value={itemData.serial_number||""}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Serial number"
              required
            />
          </div>
        </div>

        <div className="flex flex-row">
          <div class="mb-5 w-96 mr-20">
            <label
              htmlFor="installation_date"
              class="block mb-2 text-md font-medium text-gray-900 dark:text-white"
            >
              Installation date
            </label>
            <input
              type="date"
              id="installation_date"
              name="installation_date"
              onChange={handleChange}
              value={itemData.installation_date}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Serial number"
              required
            />
            
          </div>
          
          
        </div>
        <label class="block mb-2 text-md font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
          <input class="block w-20 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="img_file" onChange={handleFileChange} name="img_file" ref={imgRef} type="file"/>
        


        <div class="my-5 w-80 ml-8">
            <input
              class="relative float-left -ml-[1.4rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] cursor-none appearance-none rounded-[0.25rem] border-[0.125rem] border-customeColor-100 border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] indeterminate:border-primary indeterminate:bg-primary indeterminate:after:absolute indeterminate:after:ml-[0.2rem] indeterminate:after:mt-[6px] indeterminate:after:w-[0.5rem] indeterminate:after:border-[0.05rem] indeterminate:after:border-solid indeterminate:after:border-white hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent indeterminate:focus:after:w-[0.5rem] indeterminate:focus:after:rounded-none indeterminate:focus:after:border-[0.125rem] indeterminate:focus:after:border-b-0 indeterminate:focus:after:border-l-0 indeterminate:focus:after:border-r-0 dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:indeterminate:border-primary dark:indeterminate:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
              type="checkbox"
              value=""
              id="generate_qr"
              name="generate_qr"
              checked={itemData.generate_qr}
              onChange={handleChange}
            />
            <label
              htmlFor="generate_qr"
              class="block mb-2 text-l font-medium text-gray-900 dark:text-white"
            >
              Generate Code
            </label>
          </div>

        <button
          type='submit'
          disabled={delay}
          class="text-white mt-2 bg-customeColor-400 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          
        >
          {update? "Update":"Add"}
        </button>
      </form>
    </div>
  );
}

export default AddItem;
