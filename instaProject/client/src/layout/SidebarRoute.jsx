import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Home/SideBar";
import "./SidebarLayout.css";

export default function SidebarRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        {/* Global header actions */}
        <div className="header-actions">
          <button className="back-btn" onClick={handleBack}>← Back</button>
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

