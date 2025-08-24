import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserLikes } from "../services/Like";
import PostCard from "../../../components/Home/Postcard";
import "../styles/ViewLikes.css";

export default function ViewLike() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchLikes = async () => {
    const res = await getUserLikes(id);

    const formattedPosts = res.map((like) => ({
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

    setPosts(formattedPosts);
    setLoading(false);
  };
  fetchLikes();
}, [id]);

  if (loading) return <div className="viewlike-loading">Loading...</div>;
  if (!posts.length) return <div className="viewlike-empty">No liked posts found.</div>;

  return (
    <div className="viewlike-container">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
