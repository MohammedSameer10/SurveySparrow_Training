import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Search,
  PlusCircle,
  Bell,
  Heart,
  Download,
  LogOut,
  ChevronDown,
} from "lucide-react";
import "./Sidebar.css";
import { useSelector, useDispatch } from 'react-redux';
import { refreshUser } from '../../store/userSlice';

export default function Sidebar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const hasInitialized = useSelector((state) => state.user.hasInitialized);
  const isLoading = useSelector((state) => state.user.isLoading);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  
  useEffect(() => {
    if (!hasInitialized) {
      dispatch(refreshUser());
    }
  }, [hasInitialized, dispatch]);

  const menuItems = [
    { name: "home", icon: <Home />, route: "/home" },
    { name: "search profile", icon: <Search />, route: "/searchProfile" },
    { name: "add post", icon: <PlusCircle />, route: "/addPost" },
    { name: "notification", icon: <Bell />, route: "/notification" },
  ];

  const profileItems = [
    { name: "update profile", icon: <User />, onClick: () => navigate("/updateUser") },
    { name: "view my post", icon: <Search />, onClick: () => navigate("/viewPost", { state: { user } }) },
    { name: "view likes", icon: <Heart />, onClick: () => navigate("/viewLike") },
    { name: "download data", icon: <Download />, onClick: () => navigate("/downloadCsv") },
    { name: "check activity", icon: <Bell />, onClick: () => navigate("/activity") },
  ];

  return (
    <div className="app-container">
      <div className="sidebar">
        {/* User Section */}
        <div className="user-section">
          <div className="avatar">
            {user?.image ? (
              <img
                src={`http://localhost:8080${user.image}`}
                alt={user?.username || 'user'}
                className="avatar-img"
              />
            ) : (
              "⚡"
            )}
          </div>
          <div className="hover-content">
            <h2 className="username">{user?.username}</h2>
            <p className="bio">{user?.bio}</p>
            <div className="stats">
              <span
                className="stats-link"
                onClick={() => navigate("/followPage", { state: { type: "followers" } })}
              >
                {user?.followers} followers
              </span>
              <span
                className="stats-link"
                onClick={() => navigate("/followPage", { state: { type: "following" } })}
              >
                {user?.following} following
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="menu">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className="menu-item"
              onClick={() => navigate(item.route)}
              title={item.name}
            >
              <span className="icon">{item.icon}</span>
              <span className="menu-text">{item.name}</span>
            </button>
          ))}

          <button
            className="menu-item"
            onClick={() => setProfileOpen((o) => !o)}
            title="profile"
          >
            <span className="icon"><User /></span>
            <span className="menu-text">profile</span>
            <span className="chevron"><ChevronDown size={16} style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} /></span>
          </button>
          {profileOpen && (
            <div className="profile-submenu">
              {profileItems.map((sub) => (
                <button key={sub.name} className="menu-item submenu-item" onClick={sub.onClick}>
                  <span className="icon">{sub.icon}</span>
                  <span className="menu-text">{sub.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="logout-container">
            <button className="menu-item logout" onClick={() => navigate("/")} title="Logout">
              <span className="icon">
                <LogOut />
              </span>
              <span className="menu-text">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
