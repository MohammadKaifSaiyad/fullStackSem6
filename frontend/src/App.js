import {Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Signup from './components/Signup';
import VerifyOpt from './components/VerifyOpt';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard'
import GetProfile from './components/GetProfile';
import ViewItem from './components/ViewItem';
import { Context } from './Context';
import { useState } from 'react';
import Contact from './components/Contact';
function App() {
  const [viewOnly, setViewOnly] = useState(false);
  return (
    <Context.Provider value={{viewOnlyState:[viewOnly, setViewOnly]}}>
      <div className="App">
      {/* <Header/> */}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route exact path='/aboutus' element={<About/>}/>
        <Route exact path='/signup' element={<Signup/>}/>
        <Route exact path='/verifyotp' element={<VerifyOpt/>}/>
        <Route exact path='/user/*' element={<UserDashboard/>}/>
        <Route exact path='/contact' element={<Contact/>} />
        <Route exact path='/getprofile' element={<GetProfile/>}/>
        <Route exact path='/signin' element={<Login/>}/>
        <Route exact path='/verifyemail' element={<VerifyOpt/>}/>
        <Route exact path='/view/itemdetails/:itemId' element={<ViewItem/>}/>
      </Routes>
    </div>
    </Context.Provider>
  );
}

export default App;
