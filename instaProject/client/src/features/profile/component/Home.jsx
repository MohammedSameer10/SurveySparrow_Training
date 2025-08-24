import React, { useEffect, useState } from "react";
import { getFeeds, likePost, followUser } from "../services/Home";
import PostCard from "../../../components/Home/Postcard"; 
import "../styles/Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchFeeds(page);
  }, [page]);

  const fetchFeeds = async (pageNum) => {
    setLoading(true);
    try {
      const data = await getFeeds(pageNum);

      if (data && data.posts && data.posts.length > 0) {
        setPosts((prev) => [...prev, ...data.posts]);
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

  return (
    <div className="home-container">
      <div className="posts-wrapper">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onFollow={handleFollow}
          />
        ))}

        {/* Load More or End Message */}
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          {hasMore ? (
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                background: "#2d1f6f",
                color: "white",
                cursor: "pointer",
              }}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          ) : (
            <p style={{ color: "#555", fontStyle: "italic" }}>
              🌱 Go touch some grass
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
