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
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/user") // Replace with your real API endpoint
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() =>
        setUser({
          username: "username",
          bio: "bio.....",
          followers: 12,
          following: 34,
        })
      );
  }, []);

  const menuItems = [
    { name: "home", icon: <Home />, route: "/home" },
    { name: "update profile", icon: <User />, route: "/update-profile" },
    { name: "search profile", icon: <Search />, route: "/search-profile" },
    { name: "add post", icon: <PlusCircle />, route: "/add-post" },
    { name: "search post", icon: <Search />, route: "/search-post" },
    { name: "notification", icon: <Bell />, route: "/notification" },
    { name: "view likes", icon: <Heart />, route: "/view-likes" },
    { name: "download csv", icon: <Download />, route: "/download-csv" },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* User Section */}
        <div className="user-section">
          <div className="avatar">⚡</div>
          <h2 className="username">{user?.username}</h2>
          <p className="bio">{user?.bio}</p>
          <div className="stats">
            <span>{user?.followers} followers</span>
            <span>{user?.following} following</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="menu">
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

          {/* Logout at bottom */}
          <div className="logout-container">
            <button
              className="menu-item logout"
              onClick={() => navigate("/")}
            >
              <span className="icon">
                <LogOut />
              </span>
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="main-content">
        <h1>Main Content Area</h1>
      </div>
    </div>
  );
}
