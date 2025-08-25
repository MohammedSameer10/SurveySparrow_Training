import { useEffect } from "react";
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
import { useUser } from "../../store/UserContext.jsx";

export default function Sidebar() {
  const { user, refreshUser } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    // Ensure user is fetched when sidebar mounts if not already
    if (!user) {
      refreshUser();
    }
  }, [user, refreshUser]);

  const menuItems = [
    { name: "home", icon: <Home />, route: "/home" },
    { name: "update profile", icon: <User />, route: "/updateUser" },
    { name: "search profile", icon: <Search />, route: "/searchProfile" },
    { name: "add post", icon: <PlusCircle />, route: "/addPost" },
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
