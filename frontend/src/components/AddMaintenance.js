import React, { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoInformation } from "react-icons/io5";
import {toast, ToastContainer} from 'react-toastify';
function AddMaintenance({selectedItem, setSelectedItem, setEdit, edit, selectedService, setSelectedService}) {
  const [parts, setParts] = useState([]);
  const [delay, setDelay] = useState(false);
  const [maxPart, setMaxPart] = useState(0);
  const [editService, setEditService] = useState(false);
  const [serviceData, setServiceData] = useState({
    "item_id":selectedItem? selectedItem._id: null,
    "service_date":"",
    "service_type":"",
    "service_parts":[],
    "service_description":"",
    "provider_name":"",
    "provider_email":"",
    "provider_number":"",
    "provider_details":""
  });
  const navigate = useNavigate();
  const handleAddPart = () => {
    setMaxPart((pre) => pre + 1);
    setParts((prevParts) => [...prevParts, { partName: "", partCost: "" }]);
  };
  const handleRemovePart = () => {
    setMaxPart((pre) => pre - 1);
    setParts((prevParts) => prevParts.slice(0, -1));
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newParts = [...parts];
    newParts[index][name] = value;
    setParts(newParts);
    setServiceData((pre)=>({...pre, "service_parts": parts}));
  };
  const handleChange=(e)=>{
    if(e.target.name == 'service_date'){
      const date = new Date(e.target.value);
      const fromatedDate = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+("0"+date.getDate()).slice(-2);
      console.log(fromatedDate, date);
      setServiceData((pre)=>({...pre, [e.target.name]:fromatedDate}))
      return;
    }
    else
      setServiceData((pre)=>({...pre, [e.target.name]:e.target.value}))
  }
  const fetchAddMaintenance = async()=>{
    
  }
  const handleUpdateMaintenance =async (e)=>{
    e.preventDefault();
    console.log("data to be update:", serviceData);
    const serdata = {...serviceData, "item_id":selectedItem? selectedItem._id: null,};
    // serdata.service_id = selectedService._id;
    console.log('serdata: ', serdata);
    const options={
      method: 'POST',
      headers:{
        'content-type': 'application/json'
      },
      credentials:'include',
      body: await JSON.stringify({...serdata})
    }
    fetch('https://inventoflow.onrender.com/items/addmaintenance', options)
    .then(res=>res.json())
    .then(data=>{
      if(data.status === 'SUCCESS'){
        setSelectedItem(data.item_detail);
        navigate('/user/item');
      }
      else{
        toast.error(data.message);
      }
      setServiceData({
        "service_date":"",
        "service_type":"",
        "service_parts":[],
        "service_description":"",
        "provider_name":"",
        "provider_email":"",
        "provider_number":"",
        "provider_details":""
      })
      setParts([]);
    })
    .catch(err=>{
      console.log('error:',err);
      toast.error('Error while adding maintenance');
      setServiceData({
        "service_date":"",
        "service_type":"",
        "service_parts":[],
        "service_description":"",
        "provider_name":"",
        "provider_email":"",
        "provider_number":"",
        "provider_details":""
      })
      setParts([]);
    })
    
  }

  const handleAddMaintenance = async(e)=>{
    e.preventDefault();
    setDelay(true);
    console.log("recived data:", serviceData);
    const serdata = {...serviceData, "item_id":selectedItem? selectedItem._id: null,};
    const options={
      method: 'POST',
      headers:{
        'content-type': 'application/json'
      },
      credentials:'include',
      body: await JSON.stringify({...serdata})
    }
    fetch('https://inventoflow.onrender.com/items/addmaintenance', options)
    .then(res=>res.json())
    .then(data=>{
      if(data.status === 'SUCCESS'){
        
        setSelectedItem(data.item_detail);
        navigate('/user/item');
      }
      else{
        toast.error(data.message);
      }
      setDelay(false);
    }).catch(err=>{
      setDelay(false);
      console.log('error:',err);
      toast.error('Error while adding maintenance');
    })
    setServiceData({
      "service_date":"",
      "service_type":"",
      "service_parts":[],
      "service_description":"",
      "provider_name":"",
      "provider_email":"",
      "provider_number":"",
      "provider_details":""
    })
    setParts([]);
  }
  const fillService=()=>{
    setEditService(true);
    setParts([...selectedService.parts]);
    setServiceData({
      "service_id":selectedService._id,
      "service_date":selectedService.serviceDate,
      "service_type":selectedService.serviceType,
      "service_parts":[...selectedService.parts],
      "service_description":selectedService.description,
      "provider_name":selectedService.providerDetails.name,
      "provider_email":selectedService.providerDetails.contactEmail,
      "provider_number":selectedService.providerDetails.contactNumber,
      "provider_details":selectedService.providerDetails.description
    })
    
  }
  useEffect(()=>{
    if(edit){
      console.log('selected service for editing: ', selectedService._id)
      fillService();
    }
    return ()=>{
      setServiceData({
        "service_date":"",
        "service_type":"",
        "service_parts":[],
        "service_description":"",
        "provider_name":"",
        "provider_email":"",
        "provider_number":"",
        "provider_details":""
      })
      setParts([]);
      setEdit(false);
      setSelectedService(null);
    }
  },[]);
  return (
    <div className="ml-10 mt-10">
      <ToastContainer/>
      <form class="border rounded-lg border-gray-500 p-5 mr-10" onSubmit={editService? handleUpdateMaintenance: handleAddMaintenance}>
        <div className="flex">
          <div class="mb-5 w-80 mr-10">
            <label
              htmlFor="installation_date"
              class="block mb-2 text-l font-medium text-gray-900 dark:text-white"
            >
              scheduled service date
            </label>
            <input
              type="date"
              id="service_date"
              onChange={handleChange}
              value={serviceData.service_date}
              name="service_date"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Serial number"
              required
            />
          </div>
          <div class="mb-5 ml-10 w-80">
            <label
              htmlFor="serial_number"
              class="block mb-2 text-l font-medium text-gray-900 dark:text-white"
            >
              Enter service type
            </label>
            <input
              type="text"
              id="service_type"
              name="service_type"
              onChange={handleChange}
              value={serviceData.service_type}
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Serial number"
              required
            />
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-2/6 mr-10">
            <div className="mt-2">
              <div className="flex">
                <button
                  onClick={handleAddPart}
                  className="bg-customeColor-300 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-5"
                  disabled={maxPart == 7}
                >
                  Add Part
                </button>
                <FaMinus
                  data-te-toggle="tooltip"
                  data-te-placement="right"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  title="click to remove part"
                  className="h-4 w-4 mb-5 self-center ml-2 cursor-pointer"
                  onClick={handleRemovePart}
                />
                <IoInformation
                  data-te-toggle="tooltip"
                  data-te-placement="right"
                  data-te-ripple-init
                  data-te-ripple-color="dark"
                  title="click on add to add part details"
                  className="h-4 w-4 mb-5 self-center ml-2 cursor-pointer"
                />
              </div>
              <div className="flex flex-col w-2/6">
                {parts.map((part, index) => (
                  <div
                    key={index}
                    className="mb-5"
                    style={{ display: "flex", flexDirection: "row" }}
                  >
                    <input
                      type="text"
                      name="partName"
                      value={part.partName}
                      onChange={(event) => handleInputChange(index, event)}
                      className="bg-gray-50 border mr-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Name"
                      required
                    />
                    <input
                      type="number"
                      name="partCost"
                      value={part.partCost}
                      onChange={(event) => handleInputChange(index, event)}
                      className="bg-gray-50 border ml-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Cost"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <label
              htmlFor="message"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              id="message"
              rows="4"
              onChange={handleChange}
              value={serviceData.service_description}
              name="service_description"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write service description here..."
            ></textarea>
            <button
              type="submit"
              className="mt-5 bg-customeColor-300 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-5"
            >
              {editService?"Update Maintenance":"Add Maintenance"}
            </button>
          </div>

          <div className="border rounded-lg border-gray-400 p-2 w-3/6">
            <label
              htmlFor="description"
              class="block mb-8 ml-2 mt-2 text-l font-medium text-gray-900 dark:text-white"
            >
              Service provider details
            </label>
            <input
              type="text"
              onChange={handleChange}
              name="provider_name"
              value={serviceData.provider_name}
              className="bg-gray-50 border ml-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Provider name"
            />
            <label
              htmlFor="message"
              class="block ml-4 mt-5 mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Contact details
            </label>
            <div className="flex">
              <input
                type="number"
                name="provider_number"
                value={serviceData.provider_number}
                onChange={handleChange}
                className="bg-gray-50 border ml-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter number"
              />
              <input
                type="email"
                name="provider_email"
                onChange={handleChange}
                value={serviceData.provider_email}
                className="bg-gray-50 border ml-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter email"
              />
            </div>
            <div className="mx-4 my-5">
              <label
                htmlFor="message"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                More details
              </label>
              <textarea
                id="message"
                rows="4"
                name="provider_details"
                onChange={handleChange}
                value={serviceData.provider_details}
                class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Write service description here..."
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddMaintenance;
