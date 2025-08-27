import React, { useEffect, useRef, useState } from "react";
import {
  getFeeds,
  likePost,
  removeLike,
  followUser,
  searchPosts,
  unFollowUser,
} from "../services/Home";
import PostCard from "../../../components/Home/Postcard";
import "../styles/Home.css";
import { Search as SearchIcon, Plus } from "lucide-react";
import AddPost from "../../post/components/AddPost";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState(""); 
  const [searching, setSearching] = useState(false);
  const [filterBy, setFilterBy] = useState("caption"); 
  const likeCooldownRef = useRef(new Set());
  const followCooldownRef = useRef(new Set());
  const COOLDOWN_MS = 800;
  const [showComposer, setShowComposer] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!query) fetchFeeds(page);
  }, [page, query]);
  // If redirected from AddPost, prepend the new post and show toast
  useEffect(() => {
    if (location.state?.newPost) {
      const np = location.state.newPost;
      const enriched = {
        id: np.id || Math.random().toString(36).slice(2),
        caption: np.caption ?? "",
        imagePath: np.imagePath ?? null,
        createdAt: np.createdAt || new Date().toISOString(),
        username: user?.username || "",
        profileImage: user?.image || null,
        likeCount: 0,
        likes: 0,
        likedByCurrentUser: false,
        isOwnPost: true,
      };
      setPosts((prev) => [enriched, ...prev]);
      if (location.state.toast) {
        setToast(location.state.toast);
        setTimeout(() => setToast(""), 2000);
      }
      // clean state so it doesn't reapply on back/forward
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, user]);


const normalizePosts = (posts = []) =>
  posts.map((p) => {
    const base = p.User ? {
      ...p,
      username: p.User.username || p.username || "",
      profileImage: p.User.image || p.profileImage || "",
      userId: p.User.id || p.userId,
    } : p;
    const isOwn = user?.id && base.userId === user.id;
    return {
      ...base,
      isOwnPost: !!isOwn,
      // Home feed only contains self and following users → treat as followed unless it's own post
      followed: !isOwn,
    };
  });


  const fetchFeeds = async (pageNum) => {
    setLoading(true);
    try {
      const data = await getFeeds(pageNum, 20);

      if (data && data.posts && data.posts.length > 0) {
        const normalized = normalizePosts(data.posts);
        // If we were redirected from AddPost and already prepended a new post,
        // avoid duplicating it by merging while keeping the first client-inserted one
        setPosts((prev) => {
          if (!prev.length) return [...normalized];
          const existingIds = new Set(prev.map(p => p.id));
          const merged = [...prev, ...normalized.filter(p => !existingIds.has(p.id))];
          return merged;
        });
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
    if (likeCooldownRef.current.has(postId)) return;
    likeCooldownRef.current.add(postId);
    setTimeout(() => likeCooldownRef.current.delete(postId), COOLDOWN_MS);

    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: (p.likes || 0) + 1, likedByCurrentUser: true } : p));
    const res = await likePost(postId);
    if (!res) {
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: Math.max((p.likes || 1) - 1, 0), likedByCurrentUser: false } : p));
    }
  };

  const handleUnlike = async (postId) => {
    if (likeCooldownRef.current.has(postId)) return;
    likeCooldownRef.current.add(postId);
    setTimeout(() => likeCooldownRef.current.delete(postId), COOLDOWN_MS);
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: Math.max((p.likes || 1) - 1, 0), likedByCurrentUser: false } : p));
    const res = await removeLike(postId);
    if (!res) {
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes: (p.likes || 0) + 1, likedByCurrentUser: true } : p));
    }
  };

  const handleFollow = async (userId) => {
    if (followCooldownRef.current.has(userId)) return;
    followCooldownRef.current.add(userId);
    setTimeout(() => followCooldownRef.current.delete(userId), COOLDOWN_MS);
    setPosts((prev) => prev.map((p) => p.userId === userId ? { ...p, followed: true } : p));
    const res = await followUser(userId);
    if (!res) {
      setPosts((prev) => prev.map((p) => p.userId === userId ? { ...p, followed: false } : p));
    }
  };

  const handleUnfollow = async (userId) => {
    if (followCooldownRef.current.has(userId)) return;
    followCooldownRef.current.add(userId);
    setTimeout(() => followCooldownRef.current.delete(userId), COOLDOWN_MS);
    setPosts((prev) => prev.map((p) => p.userId === userId ? { ...p, followed: false } : p));
    const res = await unFollowUser(userId);
    if (!res) {
      setPosts((prev) => prev.map((p) => p.userId === userId ? { ...p, followed: true } : p));
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
      <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
        <button
          className="addpost-btn"
          onClick={() => navigate('/addPost')}
          style={{ marginLeft: 'auto' }}
        >
          <span>＋</span>
        </button>
      </div>
      {/* Add new post CTA outside container is managed by layout; as fallback keep inline button hidden */}
      {showComposer && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, width: "min(520px, 92vw)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Add Post</h3>
              <button className="icon-btn" aria-label="Close" onClick={() => setShowComposer(false)}>✕</button>
            </div>
            <AddPost onSuccess={(res) => {
              const newPost = {
                id: res?.id || Math.random().toString(36).slice(2),
                caption: res?.caption ?? "",
                imagePath: res?.image ?? null,
                createdAt: new Date().toISOString(),
                username: user?.username || "",
                profileImage: user?.image || null,
                likeCount: 0,
                likes: 0,
                likedByCurrentUser: false,
                isOwnPost: true,
              };
              setPosts((prev) => [newPost, ...prev]);
              setToast("✅ Your post has been added!");
              setTimeout(() => setToast(""), 2000);
              setShowComposer(false);
            }} />
          </div>
        </div>
      )}
      {toast && <div className="inline-toast">{toast}</div>}
      <div className="posts-wrapper">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onUnlike={handleUnlike}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            unfollowMode={true}
          />
        ))}
      </div>

      {/* Load More aligned with ViewPost */}
      {hasMore && !loading && !query && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="load-more-btn"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {!hasMore && !query && (
        <div style={{ textAlign: "center", margin: "12px 0", color: "#555", fontStyle: "italic" }}>
          <span>🌱 Go touch some grass</span>
        </div>
      )}
    </div>
  );
};

export default Home;
