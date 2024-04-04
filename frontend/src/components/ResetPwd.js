import React,{ useState} from 'react'
import './VerifyOtp.css'
import { FaLockOpen, FaLock } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import bcrypt from "bcryptjs";
import { useNavigate } from 'react-router-dom';

const ResetPwd= () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
        document.getElementById("password").type = "text";
      };
      const handleHidePassword = () => {
        setShowPassword(!showPassword);
        document.getElementById("password").type = "password";
      };
      const handleChangePwd = async(e)=>{
        console.log(password);
        e.preventDefault();
        if(!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/.test(password)){
            toast.error('Enter correct password')
            return;
        }
        // call the api to set password
        const hpwd = await bcrypt.hash(password, 10);
        let sessionData = await sessionStorage.getItem('userdata');
        sessionData = JSON.parse(sessionData);
        const email = sessionData.email;
        // const otp = sessionData.otp;
        console.log(email);
        const options = {
            method: "POST",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials:'include',
            body: await JSON.stringify({ email: email, password: hpwd}),
        };
        fetch('https://inventoflow.onrender.com/api/reset-pwd', options)
        .then(res=>res.json())
        .then(data=>{
            if(data.status === 'SUCCESS'){
                // sessionStorage.setItem("userdata", JSON.stringify({email: email}));
                toast.success(data.message);
                navigate('/signin')
            }
            else{
              toast.error(data.message)
            }
        })
      }
  return (
    <div className='verify-container'>
        <ToastContainer/>
      <div className='wrapper'>
      <form>
        <div className='text-xl'>
            Reset Password
        </div>
        <div class="input-box">
            <input type='password' name='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}  id='password' placeholder="Enter password" required/>
            <i>
              {
                showPassword? <FaLockOpen id="showPassword" className="cursor-pointer" onClick={handleHidePassword}/>: <FaLock id="showPassword" className="cursor-pointer" onClick={handleShowPassword}/>
              }
            </i>
        </div>
        <button type="button" onClick={handleChangePwd} class="btn">Continue</button>
        <p className='mt-1'>Password must contain </p>
        <div className='mt-1 ml-2 text-xs'>
            <p>one digit, no space,</p>
            <p>one lowercase letter,</p>
            <p>one uppercase letter,</p> 
            <p>one special character,</p> 
            <p> and it must be 8-16 characters long.</p>
        </div>
      </form>
    </div>
    </div>
  )
}

export default ResetPwd;