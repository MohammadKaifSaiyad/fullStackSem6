import {Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Signup from './components/Signup';
import VerifyOpt from './components/VerifyOpt';
import Login from './components/Login';
import User from './components/User'
function App() {
  return (
    <div className="App">
      {/* <Header/> */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route exact path='/aboutus' element={<About/>}/>
        <Route exact path='/signup' element={<Signup/>}/>
        <Route exact path='/verifyotp' element={<VerifyOpt/>}/>
        <Route exact path='/user' element={<User/>}/>
        <Route exact path='/signin' element={<Login/>}/>
        <Route exact path='/verifyemail' element={<VerifyOpt/>}/>
      </Routes>
    </div>
  );
}

export default App;
