import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getMyPosts, searchMyPosts } from "../services/Post";
import PostCard from "../../../components/Home/Postcard";
import { likePost } from "../../profile/services/Home";
import axiosInstance from "../../../AxiosInstance";
import "../styles/ViewPost.css";

export default function ViewPost() {
  const location = useLocation();
  const [user, setUser] = useState(location.state?.user || null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) return;
      try {
        const res = await axiosInstance.get("/users/getCurrentUser");
        setUser(res.data);
      } catch (e) {
        console.error("Failed to fetch current user:", e);
        setUser(null);
      }
    };
    fetchUser();
  }, [user]);

  useEffect(() => {
    if (!search) {
      setPage(1);
      loadPosts(1, true);
    }
  }, [search]);

  useEffect(() => {
    if (!search && page > 1) {
      loadPosts(page, false);
    }
  }, [page]);

  const loadPosts = async (pageNumber, replace = false) => {
    setLoading(true);
    try {
      const data = await getMyPosts(pageNumber);
      if (replace) {
        setPosts(data.posts || []);
      } else {
        setPosts((prev) => [...prev, ...(data.posts || [])]);
      }
      setHasMore(pageNumber < (data.totalPages || 1));
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e.key !== "Enter") return;
    if (!search.trim()) {
      setPage(1);
      loadPosts(1, true);
      return;
    }
    setLoading(true);
    try {
      const data = await searchMyPosts(search.trim());
      setPosts(
        (data.posts || []).map((post) => ({
          ...post,
          username: user?.username || "Me",
          profileImage: user?.image || null,
          isOwnPost: true,
        }))
      );
      setHasMore(false);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) setPage((prev) => prev + 1);
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likeCount: (p.likeCount || 0) + (p.likedByCurrentUser ? 0 : 1),
                likedByCurrentUser: true,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  return (
    <div className="viewpost-container">
      <input
        type="text"
        placeholder="Search my posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        className="viewpost-search"
      />

      <div className="viewpost-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                username: post.username || user?.username || "Me",
                profileImage: post.profileImage || user?.image || null,
                image: post.image || null,
                isOwnPost: true,
              }}
              onLike={handleLike}
            />
          ))
        ) : (
          <p className="no-posts">No posts found.</p>
        )}
      </div>

      {loading && <p className="loading">Loading...</p>}

      {hasMore && !search && !loading && (
        <button className="loadmore-btn" onClick={handleLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
}
