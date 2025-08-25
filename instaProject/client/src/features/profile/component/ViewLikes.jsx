import { useEffect, useState } from "react";
import { getUserLikes } from "../services/Like";
import { removeLike } from "../services/Home";
import PostCard from "../../../components/Home/Postcard";
import "../styles/ViewLikes.css";

export default function ViewLike() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [removingIds, setRemovingIds] = useState([]);

useEffect(() => {
  const fetchLikes = async () => {
    const data = await getUserLikes({ page, limit: 20 });
    const formattedPosts = (data.likes || []).map((like) => ({
      id: like.postId,
      caption: like.caption || "",
      imagePath: like.imagePath || null,
      createdAt: like.createdAt,
      userId: like.user?.id || "",
      username: like.user?.username || "Unknown",
      profileImage: like.user?.image || "/default-profile.png",
      likeCount: like.likeCount || 0,
      likedByCurrentUser: like.likedByCurrentUser || false,
    }));

    if (page === 1) {
      setPosts(formattedPosts);
    } else {
      setPosts((prev) => [...prev, ...formattedPosts]);
    }
    setTotalPages(data.totalPages || 1);
    setLoading(false);
    setIsLoadingMore(false);
  };
  fetchLikes();
}, [page]);

  const handleUnlike = async (postId) => {
    // optimistic remove from list
    setRemovingIds((prev) => [...prev, postId]);
    const prevPosts = posts;
    setPosts((curr) => curr.filter((p) => p.id !== postId));
    const ok = await removeLike(postId);
    setRemovingIds((prev) => prev.filter((id) => id !== postId));
    if (!ok) {
      // rollback
      setPosts(prevPosts);
    }
  };

  if (loading) return <div className="viewlike-loading">Loading...</div>;
  if (!posts.length) return <div className="viewlike-empty">No liked posts found.</div>;

  return (
    <div className="viewlike-container">
      {posts.map((post) => (
        <div key={post.id} style={{ opacity: removingIds.includes(post.id) ? 0.5 : 1 }}>
          <PostCard post={post} onUnlike={handleUnlike} />
        </div>
      ))}

      <div className="pagination-controls">
        {page < totalPages && (
          <button
            className="load-more-btn"
            disabled={isLoadingMore}
            onClick={() => {
              setIsLoadingMore(true);
              setPage((p) => p + 1);
            }}
          >
            {isLoadingMore ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
}
