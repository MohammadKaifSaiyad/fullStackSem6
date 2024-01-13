import { Link } from 'react-router-dom';
// import useSWR from 'swr';
import React, {useState } from 'react';
import './Signup.css'
import bcrypt from 'bcryptjs'
import VerifyOpt from './VerifyOpt';
import { useNavigate } from 'react-router-dom';


// SALT should be created ONE TIME upon sign up
// const salt = bcrypt.genSaltSync(10)


function Signup(){

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [showVerifyOtpForm, setShowVerifyOtpForm] = useState(false);
  const navigate = useNavigate();
  const checkDetails=(username, email, password, cpassword)=>{
    if(!/[A-Za-z]+[0-9a-zA-Z]*/.test(username)){
      return 1;
    }
    else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
      return 2;
    }
    else if(password.length <8 || password!=cpassword){
      return 3;
    }
    return 0;
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    const check = 0;
    // checkDetails(username, email, password, cpassword);

    if(check === 0){
      const hpwd = await bcrypt.hash(password, 10);
      const data = {username: username,email: email,hashpassword: hpwd};
      const reqdata = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
      };
      
      await fetch('/api/usersignup',reqdata)
        .then(res=>res.json())
        .then(data=>{
          console.log(data);
          if(data.status == 'SUCCESS'){
            const data2 = {username: username,email: email};
            sessionStorage.setItem("userdata", JSON.stringify(data2));
            // setShowVerifyOtpForm(true);
            navigate('/verifyemail');
          }
        })
      // window.location.replace("/verifyotp");
      // await fetch("http://localhost:5000/verifyotp", reqdata);

      // fetch('http://localhost:5000/api/usersignup',reqdata)
      // .then(resbody=>resbody.json())
      // .then(res=>{
      //   console.log(res);
      //   // if(res.get('status')==='true'){
      //   //   window.location.replace("http://localhost:5000/verifyotp");
      //   //   console.log('after url changed')
      //   // }
      // }).catch(e=>{console.log("error while sending data");}).done();
      
      
    }
    else{
      console.log("error during data filling");
    }
    
    setUsername('');
    setEmail('');
    setPassword('');
    setCPassword('');
  };
  

  // return(
  // <>
  //   {
  //     showVerifyOtpForm ? <VerifyOpt/> : <><div className="signup-class">
  //     <div className='container'>
  //       <div className='heading'>
  //         <h2 className='text'>InventoFlow</h2>
  //       </div>
  //       <div className='inputs'>
  //         <div className='input'>
  //             <input type="text" placeholder="Username" value={username} id='username' onChange={(e)=>setUsername(e.target.value)} required/>
  //         </div>
  //         <div className='input'>
  //           <input type="Email" placeholder="Email" id='email'  value={email} onChange={(e)=>setEmail(e.target.value)} required/>
  //         </div>
  //         <div className='input'>
  //           <input type="password" placeholder="Password" id='pwd' value={password} onChange={(e)=>setPassword(e.target.value)}required/>
  //         </div>
  //         <div className='input'>
  //           <input type="password" placeholder="Confirm password  " value={cpassword} id='cpwd' onChange={(e)=>setCPassword(e.target.value)} required/>
  //         </div>
  //         <div className='lost-password'>Lost Password? Click Here!</div>
  //         <div className='submit-container'>
  //           <div className='submit' onClick={handleSignup}>Verify</div>
  //         </div>
  //       </div>
  //       <div className='other-options'>
  //         <div className='google'>google</div>
  //       </div>
  //       <div className='login'>Already have an account? <Link to="/user/login">login</Link></div>
  //     </div>
  //   </div></>
  //   }
  // </>);

  return(<>
    <div class="wrapper">
        <form>
            <h1>Sign up</h1>
            <button type="google" class="ggl"><img src={require('./img/google.png')}/> Continue with Google</button>
            <div class="txt">
            ---Or Continue with username/email---
            </div>
            
            <div class="input-box">
                <input type="text" placeholder="Username" onChange={(e)=>setUsername(e.target.value)} value={username} required/>
                <i class='bx bx-user'></i>
            </div>

            <div class="input-box">
                <input type="text" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                <i class='bx bx-envelope' ></i>
            </div>
            
            <div class="input-box">
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                <i class='bx bx-lock-alt'></i>
            </div>

            <div class="input-box">
                <input type="password" placeholder="Confirm Password" value={cpassword} onChange={(e)=>setCPassword(e.target.value)} required/>
                <i class='bx bx-lock-open-alt'></i>
            </div>

            <button type="button" class="btn" onClick={handleSignup}>Submit</button>
            
            <div class="register-link">
                <p>Already have an account? <Link to="/signin">Sign in</Link></p>
            </div>
        </form>
    </div>
  </>);
}

export default Signup;