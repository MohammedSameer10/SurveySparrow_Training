import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Register from "./features/auth/component/Register";
import Home from "./features/profile/component/Home";
import Login from "./features/auth/component/Login";
import Layout from "./layout/SidebarRoute";
import UpdateUser from "./features/profile/component/UpdateUser";
import SearchProfile from "./features/profile/component/SearchProfile";

function App() {
  return (
    <div className="mainApp">
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/updateUser" element={<UpdateUser />} />
            <Route path="/searchProfile" element={<SearchProfile />} />

          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
