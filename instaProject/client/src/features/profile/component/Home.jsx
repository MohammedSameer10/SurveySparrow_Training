import React, { useEffect, useState } from "react";
import {
  getFeeds,
  likePost,
  removeLike,
  followUser,
  searchPosts,
} from "../services/Home";
import PostCard from "../../../components/Home/Postcard";
import "../styles/Home.css";
import { Search as SearchIcon } from "lucide-react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState(""); // search query
  const [searching, setSearching] = useState(false);
  const [toast, setToast] = useState("");
  const [filterBy, setFilterBy] = useState("caption"); // caption | username

  useEffect(() => {
    if (!query) fetchFeeds(page);
  }, [page, query]);


const normalizePosts = (posts = []) =>
  posts.map((p) => {
    if (p.User) {
      return {
        ...p,
        username: p.User.username || p.username || "",
        profileImage: p.User.image || p.profileImage || "",
        userId: p.User.id || p.userId,
      };
    }
    return p;
  });


  const fetchFeeds = async (pageNum) => {
    setLoading(true);
    try {
      const data = await getFeeds(pageNum);

      if (data && data.posts && data.posts.length > 0) {
        const normalized = normalizePosts(data.posts);
        setPosts((prev) => [...prev, ...normalized]);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setHasMore(false);
    }
    setLoading(false);
  };

  const handleLike = async (postId) => {
    // optimistic
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: (p.likes || 0) + 1, likedByCurrentUser: true } : p));
    const res = await likePost(postId);
    if (!res) {
      // rollback
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: Math.max((p.likes || 1) - 1, 0), likedByCurrentUser: false } : p));
    }
  };

  const handleUnlike = async (postId) => {
    // optimistic
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: Math.max((p.likes || 1) - 1, 0), likedByCurrentUser: false } : p));
    const res = await removeLike(postId);
    if (!res) {
      // rollback
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: (p.likes || 0) + 1, likedByCurrentUser: true } : p));
    }
  };

  const handleFollow = async (userId) => {
    // optimistic: mark posts from this user as followed to disable button
    setPosts((prev) => prev.map((p) => p.userId === userId ? { ...p, followed: true } : p));
    setToast("Followed user");
    setTimeout(() => setToast(""), 1500);
    const res = await followUser(userId);
    if (!res) {
      // rollback
      setPosts((prev) => prev.map((p) => p.userId === userId ? { ...p, followed: false } : p));
      setToast("Failed to follow");
      setTimeout(() => setToast(""), 1500);
    }
  };

  /* 🔑 Debounced Search */
  useEffect(() => {
    if (query.trim() === "") {
      setPosts([]);
      setPage(1);
      setSearching(false);
      return;
    }

    setSearching(true);

    const delayDebounce = setTimeout(async () => {
      try {
        const data = await searchPosts(query, { filterBy, sortOrder: "DESC", page: 1, limit: 50 });
        const normalized = normalizePosts(data.posts || []);
        setPosts(normalized);
        setHasMore(false); // no pagination for search
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce); // cleanup old timer
  }, [query, filterBy]);

  return (
    <div className="home-container">
      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <button className="icon-btn" onClick={() => { /* no-op, visual cue */ }} aria-label="Search">
          <SearchIcon size={18} />
        </button>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="search-filter"
        >
          <option value="caption">Caption</option>
          <option value="username">Username</option>
        </select>
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {toast && (
        <div className="inline-toast">{toast}</div>
      )}

      <div className="posts-wrapper">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onUnlike={handleUnlike}
            onFollow={handleFollow}
          />
        ))}

        {!searching && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            {hasMore ? (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={loading}
                className="load-more-btn"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            ) : (
              <p style={{ color: "#555", fontStyle: "italic" }}>
                🌱 Go touch some grass
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
