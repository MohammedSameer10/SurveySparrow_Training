import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../services/Profile";
import PostCard from "../../../components/Home/Postcard";
import "../styles/ViewUser.css";
import { useDispatch } from "react-redux";
import { refreshUser } from "../../../store/userSlice";
import { followUser, unFollowUser } from "../services/Home";

export default function ViewUser() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getPublicProfile(id);
        setProfile(data.user);
        setPosts((data.posts || []).slice(0, 10));
        // Best-effort: if viewing another user, assume following if not own (feed logic could be extended)
        setIsFollowing(false);
      } catch (e) {
        console.error("Failed to load user:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleFollowToggle = async () => {
    try {
      if (!profile) return;
      if (isFollowing) {
        setIsFollowing(false);
        await unFollowUser(profile.id);
      } else {
        setIsFollowing(true);
        await followUser(profile.id);
      }
      await dispatch(refreshUser()).unwrap();
    } catch (e) {
      // rollback on error
      setIsFollowing((prev) => !prev);
      console.error("Follow toggle failed", e);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!profile) return <div style={{ padding: 20 }}>User not found</div>;

  return (
    <div className="viewuser-container">
      <div className="viewuser-header">
        {profile.image && (
          <img
            src={`http://localhost:8080${profile.image}`}
            alt={profile.username}
            className="viewuser-avatar"
          />
        )}
        <div className="viewuser-info">
          <div className="viewuser-toprow">
            <h2 className="viewuser-username">{profile.username}</h2>
            <button className={`viewuser-follow-btn ${isFollowing ? 'unfollow' : ''}`} onClick={handleFollowToggle}>
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          </div>
          <p className="viewuser-bio">{profile.bio || "No bio"}</p>
          <div className="viewuser-counters">
            <span>{profile.followers} followers</span>
            <span>{profile.following} following</span>
          </div>
        </div>
      </div>

      <div className="viewuser-posts">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} unfollowMode={true} />)
        )}
      </div>

      <div className="viewuser-footnote">
        Follow this user to see more posts.
      </div>
    </div>
  );
}
