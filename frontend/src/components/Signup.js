import { Link } from "react-router-dom";
import React, { useState } from "react";
import "./Signup.css";
import bcrypt from "bcryptjs";
import VerifyOpt from "./VerifyOpt";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [cpassword, setCPassword] = useState("");
  const [showVerifyOtpForm, setShowVerifyOtpForm] = useState(false);
  const navigate = useNavigate();
  const checkDetails = (username, email, password, cpassword) => {
    if (!/[A-Za-z]+[0-9a-zA-Z]*/.test(username)) {
      toast.error('Enter a valid username');
      return 1;
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast.error('Enter a valid email');
      return 2;
    } else if (password.length < 8) {
      toast.error('password length is less than 8');
      return 3;
    }
    else if(password != cpassword){
      toast.error('confirm password and password are not same');
      return 4;
    }
    return 0;
  };
  const handleSginupWithGoogle = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    // const check = 0;
    username = username.trim();
    email = email.trim();
    password = password.trim();
    cpassword = cpassword.trim();
    const check = checkDetails(username, email, password, cpassword);

    if (check === 0) {
      const hpwd = await bcrypt.hash(password, 10);
      const data = { username: username, email: email, hashpassword: hpwd };
      const reqdata = {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      };

      await fetch("/api/usersignup", reqdata)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status == "SUCCESS") {
            const data2 = { username: username, email: email };
            sessionStorage.setItem("userdata", JSON.stringify(data2));
            navigate("/verifyemail");
          }
          else{
            toast.error(data.message);
          }
        });
    } else {
      console.log("error during data filling");
    }

    setUsername("");
    setEmail("");
    setPassword("");
    setCPassword("");
  };

  const handleShowPassword = () => {
    if (document.getElementById("password").type == "password") {
      document.getElementById("showPassword").className = "bx bx-lock-open-alt";
      document.getElementById("password").type = "text";
    } else {
      document.getElementById("showPassword").className = "bx bx-lock-alt";
      document.getElementById("password").type = "password";
    }
  };

  return (
    
    <div className="signup-container">
      <ToastContainer/>
      <div class="wrapper">
        <div
          type="google"
          class="ggl google-btn"
          onClick={handleSginupWithGoogle}
        >
          <img src={require("./img/google.png")} /> Continue with Google
        </div>
        <form onSubmit={handleSignup}>
          <h1>Sign up</h1>

          <div class="txt">---Or Continue with username/email---</div>

          <div class="input-box">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
            />
            <i class="bx bx-user"></i>
          </div>

          <div class="input-box">
            <input
              type="text"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <i class="bx bx-envelope"></i>
          </div>

          <div class="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i class="bx bx-lock-alt"></i>
          </div>

          <div class="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => setCPassword(e.target.value)}
              id="password"
              required
            />
            <i
              class="bx bx-lock-alt"
              onClick={handleShowPassword}
              id="showPassword"
            ></i>
          </div>
          

          <button type="submit" class="btn">
            Submit
          </button>

          <div class="register-link">
            <p>
              Already have an account? <Link to="/signin">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
