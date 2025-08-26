import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Home/SideBar";
import "./SidebarLayout.css";

export default function SidebarRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        {/* Global Add Post button - outside of home container */}
        <div className="header-actions">
          <button className="addpost-btn" onClick={() => navigate('/addPost', { state: { from: location.pathname } })}>
            <span>＋</span>
            <span>add new post</span>
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

