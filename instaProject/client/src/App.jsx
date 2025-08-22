import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Register from './features/auth/component/Register'
import Home from './features/profile/component/Home'
import Login from './features/auth/component/Login'
import Sidebar from './components/Home/SideBar';
function App() {
  return (
    <div className="mainApp">
      <Router>   
        <Routes>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>
           <Route path="/SideBar" element={<Sidebar />}></Route>


        </Routes>
      </Router>
    </div>
  );
}

export default App;