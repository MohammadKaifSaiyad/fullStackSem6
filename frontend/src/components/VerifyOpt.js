import React, { useState } from 'react'
import User from './User';
import { useNavigate } from "react-router-dom";
import './VerifyOtp.css'
import { Link } from 'react-router-dom';
function VerifyOpt() {
  const [otp, setOtp] = useState('');
  const [showUserPage, setShowUserPage] = useState(false);
  const navigate = useNavigate();

  
  const handleResendCode = async()=>{
    const data = sessionStorage.getItem("userdata");
    const url = '/api/usersignup'
    const reqdata = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: data,
    };
    // console.log(JSON.parse(data));
    console.log("before calling veriryotp")
    await fetch(url,reqdata)
    
    // api call to send code and save that code into database
  }

  const handleVerifaction =async (e)=>{
    e.preventDefault();

    console.log(otp);

    // check value if wrong wait
    // if right create valid user
    // if time up show message if needed 
    let userdata = await sessionStorage.getItem("userdata");
    userdata = await JSON.parse(userdata);
    userdata.code = otp;
    console.log(userdata);
    const url = '/api/verifyemail'
    console.log('before call')
    const reqdata = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: await JSON.stringify(userdata),
    };
    await fetch('/api/verifyemail',reqdata)
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
      if(data.status == 'SUCCESS'){
        navigate('/signin');
      }
    });
    console.log('aftercalling')
 }
  return (
      <div className='wrapper'>
        
      <form>
        {/* <input type='number' placeholder='Enter OTP' onChange={e=>{setOtp(e.target.value)}}></input> */}
        <div class="input-box">
                <input type="text" placeholder="Enter Otp" onChange={e=>{setOtp(e.target.value)}} value={otp} required/>
                <i class='bx bx-otp'></i>
        </div>
        <button type="button" class="btn" onClick={handleVerifaction}>Verify</button>

        {/* <button onClick={handleVerifaction} >verify</button> */}
        <div class="register-link">
          <p>Don't recive code? <Link onClick={handleResendCode}>resend code</Link></p>
        </div>
        {/* <span onClick={handleResendCode}>resend code</span> */}
      </form>
    </div>
  )
}

export default VerifyOpt;