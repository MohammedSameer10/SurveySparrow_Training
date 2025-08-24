import { useState } from "react";
import { Search } from "lucide-react";
import { searchUsers } from "../services/Profile";
import axiosInstance from "../../../AxiosInstance";
import "../styles/SearchProfile.css";

export default function SearchProfile() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await searchUsers({
        searchTerm: query,
        limit: 100,
        page: 1,
      });
      setResults(res.users || []);
    } catch (err) {
      console.error("Error searching profile:", err);
    }
  };

  const handleFollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await axiosInstance.post("/follow/remove", { followingId: userId });
      } else {
        await axiosInstance.post("/follow/add", { followingId: userId });
      }
      setResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isFollowing: !isFollowing } : u
        )
      );
    } catch (err) {
      console.error("Error follow/unfollow:", err);
    }
  };

  // take backend base URL from axios instance
  const BASE_URL = axiosInstance.defaults.baseURL;

  return (
    <div className="search-profile-container">
      <div className="search-bar">
        <button onClick={handleSearch} className="search-btn">
          <Search />
        </button>
        <input
          type="text"
          placeholder="Search profile..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="results-list">
        {results.length === 0 ? (
          <p className="no-results">No results found</p>
        ) : (
          results.map((user) => (
            <div key={user.id} className="profile-card">
              <div className="profile-avatar">
                {user.image ? (
                  <img
                    src={`${BASE_URL}${user.image}`} // prepend base url
                    alt={user.username}
                    className="avatar-img"
                  />
                ) : (
                  <span className="avatar-placeholder">
                    {user.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              <div className="profile-info">
                <p className="profile-username">{user.username}</p>
                <p className="profile-bio">{user.bio || "No bio available"}</p>
              </div>
              <div className="profile-action">
                <button
                  className={`follow-btn ${
                    user.isFollowing ? "unfollow" : "follow"
                  }`}
                  onClick={() => handleFollow(user.id, user.isFollowing)}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
