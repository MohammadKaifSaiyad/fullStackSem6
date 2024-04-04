import React, { useState } from "react";
import bcrypt from "bcryptjs";
import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLockOpen, FaLock } from "react-icons/fa";
import axios from 'axios';
function Login() {
  const [delay, setDelay] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const checkDetails = (email, password) => {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return 1;
    } else if (password.length < 8) {
      return 2;
    }
    return 0;
  };
  const handleLoginWithGoogle = () => {
    // navigate('/auth/google')
    window.location.href = "https://inventoflow.onrender.com/auth/google";
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setDelay(true);
    const userEmail = email.trim();
    const userPassword = password.trim();
    const check = checkDetails(userEmail, userPassword);
    if (check != 0) {
      console.log('entered data is not in proper format')
      toast.error('invalid data');
    }
    const reqdata = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      credentials:'include',
      body: await JSON.stringify({ email: userEmail, password: userPassword }),
    };

    await fetch("https://inventoflow.onrender.com/api/user/login", reqdata)
      .then((res) => res.json())
      .then(async (data) => {
        if(data.status==='SUCCESS'){
          setDelay(false);
          console.log("data after fecth form login", data);
          navigate("/user");
        }else{
          toast.error(data.message);
          setDelay(false);
        }
      })
      .catch(err=>{
        console.log('error: ',err);
        setDelay(false);
        toast.error('Failed to login');
      })

    setEmail("");
    setPassword("");
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
    document.getElementById("password").type = "text";
  };
  const handleHidePassword = () => {
    setShowPassword(!showPassword);
    document.getElementById("password").type = "password";
  };
  return (
    <div className="login-container">
      <ToastContainer />
      <div className="wrapper">
        <div
          type="google"
          class="ggl google-btn"
          onClick={handleLoginWithGoogle}
        >
          <img src={require("./img/google.png")} /> Continue with Google
        </div>
        <form onSubmit={handleLogin}>
          <h1>Login</h1>

          <div class="txt">---Or Continue with username/email---</div>
          <div class="input-box">
            <input
              type="text"
              placeholder="Email"
              onInput={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
              required
            />
            <i class="bx bx-user"></i>
          </div>
          <div class="input-box flex">
            <input
              type="password"
              placeholder="Password"
              onInput={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              id="password"
              required
            />
            <i>
              {
                showPassword? <FaLockOpen id="showPassword" className="cursor-pointer" onClick={handleHidePassword}/>: <FaLock id="showPassword" className="cursor-pointer" onClick={handleShowPassword}/>
              }
            </i>
            {/* <i
              class="bx bx-lock-alt"
              onClick={handleShowPassword}
              id="showPassword"
            ></i> */}
          </div>

          <div class="remember-forgot">
            <Link to="/forgotpwd">Forgot password?</Link>
          </div>

          <button type="submit" class="btn" disabled={delay}>
            Login
          </button>
          <div class="register-link">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
