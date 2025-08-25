import React, { useEffect, useState } from "react";
import {
  getFeeds,
  likePost,
  followUser,
  searchPosts,
} from "../services/Home";
import PostCard from "../../../components/Home/Postcard";
import "../styles/Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState(""); // search query
  const [searching, setSearching] = useState(false);

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
    const res = await likePost(postId);
    if (res) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p
        )
      );
    }
  };

  const handleFollow = async (userId) => {
    const res = await followUser(userId);
    if (res) {
      alert("Followed user!");
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
        const data = await searchPosts(query);
        const normalized = normalizePosts(data.posts || []);
        setPosts(normalized);
        setHasMore(false); // no pagination for search
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce); // cleanup old timer
  }, [query]);

  return (
    <div className="home-container">
      {/* 🔍 Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="posts-wrapper">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
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
