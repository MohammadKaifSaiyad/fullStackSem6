import React, {useState } from 'react';
import bcrypt from 'bcryptjs'
import './Login.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const checkDetails=(email, password)=>{
        if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
          return 1;
        }
        else if(password.length <8){
          return 2;
        }
        return 0;
    }

    const handleLogin= async (e)=>{
        e.preventDefault();
        const check = checkDetails(email, password);
        // const check = 0;
        if(check != 0){
            // error in entering data
        }
        //
        const reqdata = {
            method: 'POST',
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
            body: await JSON.stringify({email: email, password: password}),
        };

        await fetch('/api/user/login',reqdata)
        .then(res=>res.json())
        .then(async data=>{
            console.log('data after fecth form login',data);
            navigate('/user');
        })

        setEmail('');
        setPassword('');
    }

  // return (
  //   <div>
  //       Login page
  //       <div className=''>
  //           <input type='email' placeholder='Enter Email' onChange={e=>{setEmail(e.target.value)}}/>
  //           <input type='password' placeholder='enter password' onChange={(e)=>{setPassword(e.target.value)}}/>
  //           <button onClick={handleLogin}>Login</button>
  //       </div>
  //   </div>
  // )
  return(<>
        <div className="wrapper">
        <form>
            <h1>Login</h1>
            <button type="google" class="ggl"><img src={require('./img/google.png')}/> Continue with Google</button>
            <div class="txt">
            ---Or Continue with username/email---
            </div>
            <div class="input-box">
                <input type="text" placeholder="Email" onChange={e=>{setEmail(e.target.value)}} value={email} required/>
                <i class='bx bx-user'></i>
            </div>
            <div class="input-box">
                <input type="password" placeholder="Password" onChange={e=>{setPassword(e.target.value)}} value={password} required/>
                <i class='bx bx-lock-alt'></i>
            </div>

            <div class="remember-forgot">
                <label><input type="checkbox"/> Remember me</label>
                <Link href="#">Forgot password?</Link>
            </div>

            <button type="button" class="btn" onClick={handleLogin}>Login</button>
            <div class="register-link">
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        </form>
    </div>
  </>);
}

export default Login