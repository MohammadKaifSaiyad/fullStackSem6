import React, { useState } from 'react'
import './VerifyOtp.css'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

const ForgotPwd = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(false)
    const [email, setEmail] = useState("");
    const [userOTP, setUserOTP] = useState("");
    const handleForgotPwd = async(e)=>{
        e.preventDefault();
        const options = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials:'include',
            body: await JSON.stringify({ email: email}),
        };
        fetch('https://inventoflow.onrender.com/api/forgotpwd', options)
        .then(res=>res.json())
        .then(data=>{
            if(data.status === 'SUCCESS'){
                setOtp(true);
            }
            else{
              toast.error(data.message);
              toast.error('Go back and try again');
            }
        })
        .catch(err=>{
          toast.error('Go back');
          toast.error('Something went wrong');
          console.error('Error: ',err);
        })
    }
    const handleVefiryOtp =async(e)=>{
        e.preventDefault();
        console.log(userOTP);
        const options = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials:'include',
            body: await JSON.stringify({ email: email, otp: userOTP}),
        };
        fetch('https://inventoflow.onrender.com/api/reset-otp', options)
        .then(res=>res.json())
        .then(data=>{
            if(data.status === 'SUCCESS'){
                sessionStorage.setItem("userdata", JSON.stringify({email: email}));
                navigate('/reset-pwd')
            }else{
              toast.error(data.message);
              toast.error('Go back');
            }
        })
        .catch(err=>{
          toast.error('Go back');
          toast.error('Something went wrong');
          console.error('Error: ',err);
        })
    }
  return (
    <div className='verify-container'>
      <ToastContainer/>
      <div className='wrapper'>
        
      <form>
        {/* <input type='number' placeholder='Enter OTP' onChange={e=>{setOtp(e.target.value)}}></input> */}
        {
            otp? 
            <div class="input-box">
                <input type="number" placeholder="Enter OTP" value={userOTP} onChange={(e)=>{setUserOTP(e.target.value)}} required/>
            </div>
            :
            <div class="input-box">
                <input type="email" placeholder="Enter Email" value={email} onChange={(e)=>{setEmail(e.target.value)}} required/>
            </div>
        }
        <button type="button" onClick={otp? handleVefiryOtp :handleForgotPwd} class="btn">Continue</button>
      </form>
    </div>
    </div>
  )
}

export default ForgotPwd