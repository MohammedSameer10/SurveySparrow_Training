import { Outlet } from "react-router-dom";
import Sidebar from "../components/Home/SideBar";
import "./SidebarLayout.css";

export default function SidebarRoute() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

