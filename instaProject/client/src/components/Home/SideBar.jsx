// src/layout/Sidebar.jsx
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
import axiosInstance from "../../AxiosInstance"; 
import "./Sidebar.css";

export default function Sidebar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Fetching current user...");
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get("/users/getCurrentUser");
        console.log("User data:", res.data);
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser({
          username: "username",
          bio: "bio.....",
          followers: 12,
          following: 34,
          image: null,
        });
      }
    };
    fetchUserData();
  }, []);

  const menuItems = [
    { name: "home", icon: <Home />, route: "/home" },
    { name: "update profile", icon: <User />, route: "/updateUser" },
    { name: "search profile", icon: <Search />, route: "/searchProfile" },
    { name: "add post", icon: <PlusCircle />, route: "/addPost" },
    // We'll handle "view post" separately below to include `state`
    { name: "notification", icon: <Bell />, route: "/notification" },
    { name: "view likes", icon: <Heart />, route: "/viewLike" },
    { name: "download csv", icon: <Download />, route: "/downloadCsv" },
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

          {/* Handle view post with user data */}
          <button
            className="menu-item"
            onClick={() => {
              navigate("/viewPost", { state: { user } });
            }}
          >
            <span className="icon"><Search /></span>
            view post
          </button>

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
