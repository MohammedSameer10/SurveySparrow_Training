import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Register from './pages/Register'
import Home from './pages/Home'
import Login from './pages/Login'
function App() {
  return (
    <div className="mainApp">
      <Router>   
        <Routes>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/" element={<Login />}></Route>
          <Route path="/home" element={<Home />}></Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;