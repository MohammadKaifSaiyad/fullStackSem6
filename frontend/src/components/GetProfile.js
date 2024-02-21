import React, { useState , useRef} from 'react'
import { useNavigate } from 'react-router-dom';
import './GetProfile.css';
import imageCompression from 'browser-image-compression';
import axios from 'axios';

function GetProfile() {
    const [area, setArea] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        console.log(file,'file is ')
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            console.log('filereder.result')
            const compressedImage = compressImage(file);
            console.log('compressedimg',compressedImage)
            setSelectedImage(reader.result);
            // setSelectedFile(compressedImage);
          };
          reader.readAsDataURL(file);
          console.log('filecontent',file)
        }
      };
    const handleImageClick = () => {
        // Trigger a click event on the hidden file input when the user clicks on the image
        fileInputRef.current.click();
    };

    const compressImage = async (imageFile) => {
      const options = {
        maxSizeMB: 1,          // Max size in megabytes
        maxWidthOrHeight: 800, // Max width or height
        useWebWorker: true,
      };
  
      try {
        const compressedFile = await imageCompression(imageFile, options);
        setSelectedFile(compressedFile);
        return compressedFile;
      } catch (error) {
        throw error;
      }
    };


    const handleCreatingUser = async (e)=>{
      e.preventDefault();
      console.log('selected image')
      
      let data = await sessionStorage.getItem("userdata");
      console.log('keys',Object.keys(sessionStorage))
      console.log("data via session",data)
      data = JSON.parse(data);
      const formData = new FormData();
      console.log("selectedFile data:",selectedFile);
      formData.append('image', selectedFile)
      console.log("formData: ",formData);
      
      formData.append('area_name',area);
      formData.append('email',data.email);
      // data.area= area
      // data.profileImg = selectedFile;
      console.log("user data of getprofile ",selectedFile, area);
      
      try {
        await axios.post('http://localhost:5000/api/user/createloggedinuser',formData,{
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
          body:JSON.stringify({'area_name':area, 'email':data.email})
        }).then(res=>{
          console.log(res.statusText)
          if(res.statusText==='OK'){
            navigate('/signin')
          }
        })
        
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    
  return (
    <div className='getprofile-container'>
    <div className='wrapper'>
      <form onSubmit={handleCreatingUser} encType='multipart/form-data'>
        <div className="profile-image-container">
        {/* {selectedImage} */}
            <img
                src={selectedImage || require('./img/user_profile_default.webp')}
                alt="Profile"
                className="profile-image"
                onClick={handleImageClick}
                style={{ cursor: 'pointer' }}
            />

            <input
                type="file"
                accept="image/*"
                id="image"
                name="image"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: 'none' }}
            />
        </div>
        <div class="input-box">
                <input type="text" placeholder="Enter area or session name" id='area_name' onChange={e=>{setArea(e.target.value)}} onInput={e=>{setArea(e.target.value)}} value={area} required/>
                <i class='bx bx-otp'></i>
        </div>
        <button type="submit" class="btn">Add</button>
        </form>
        {/* <button type="button" class="btn" onClick={handleVerifaction}>Verify</button> */}
    </div>
    </div>
  )
}
export default GetProfile;