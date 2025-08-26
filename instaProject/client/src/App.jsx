import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Register from "./features/auth/component/Register";
import Home from "./features/profile/component/Home";
import Login from "./features/auth/component/Login";
import Layout from "./layout/SidebarRoute";
import UpdateUser from "./features/profile/component/UpdateUser";
import SearchProfile from "./features/profile/component/SearchProfile";
import AddPost from './features/post/components/AddPost';
import ViewPost from './features/post/components/ViewPost';
import ViewLike from './features/profile/component/ViewLikes';
import Notification from './features/notification/component/Notification';
import DownloadCsv from "./features/profile/component/DownloadCsv";
import FollowPage from "./features/profile/component/FollowPage";
import CheckActivity from "./features/profile/component/CheckActivity";



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
            <Route path="/addPost" element={<AddPost />} />
            <Route path="/viewPost" element={<ViewPost />} />
            <Route path="/ViewLike" element={<ViewLike />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/DownloadCsv" element={<DownloadCsv />} />
            <Route path="/followPage" element={<FollowPage />} />
            <Route path="/activity" element={<CheckActivity />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
