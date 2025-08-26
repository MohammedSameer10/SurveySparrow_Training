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
import { useUser } from "../../store/UserContext.jsx";

export default function Sidebar() {
  const { user, refreshUser } = useUser();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  useEffect(() => {
    // Ensure user is fetched when sidebar mounts if not already
    if (!user) {
      refreshUser();
    }
  }, [user, refreshUser]);

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
                alt={user.username}
                className="avatar-img"
              />
            ) : (
              "⚡"
            )}
          </div>
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

        {/* Navigation */}
        <nav className="menu">
          {/* Primary items */}
          {menuItems.map((item) => (
            <button
              key={item.name}
              className="menu-item"
              onClick={() => navigate(item.route)}
            >
              <span className="icon">{item.icon}</span>
              {item.name}
            </button>
          ))}

          {/* Profile group */}
          <button
            className="menu-item"
            onClick={() => setProfileOpen((o) => !o)}
          >
            <span className="icon"><User /></span>
            profile
            <span style={{ marginLeft: "auto" }}><ChevronDown size={16} style={{ transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} /></span>
          </button>
          {profileOpen && (
            <div style={{ marginLeft: 28, display: "flex", flexDirection: "column", gap: 6 }}>
              {profileItems.map((sub) => (
                <button key={sub.name} className="menu-item" onClick={sub.onClick}>
                  <span className="icon">{sub.icon}</span>
                  {sub.name}
                </button>
              ))}
            </div>
          )}

          {/* Logout */}
          <div className="logout-container">
            <button className="menu-item logout" onClick={() => navigate("/")}>
              <span className="icon">
                <LogOut />
              </span>
              Logout
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
