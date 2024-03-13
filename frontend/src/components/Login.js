import React, { useState } from "react";
import bcrypt from "bcryptjs";
import "./Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setDelay(true);
    const check = checkDetails(email, password);
    if (check != 0) {
      console.log('entered data is not in proper format')
    }
    const reqdata = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: await JSON.stringify({ email: email, password: password }),
    };

    await fetch("/api/user/login", reqdata)
      .then((res) => res.json())
      .then(async (data) => {
        setDelay(false);
        console.log("data after fecth form login", data);
        navigate("/user");
      });

    setEmail("");
    setPassword("");
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
    <div className="login-container">
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
          <div class="input-box">
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
            <i
              class="bx bx-lock-alt"
              onClick={handleShowPassword}
              id="showPassword"
            ></i>
          </div>

          <div class="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <Link href="#">Forgot password?</Link>
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
