import axios from "../../../AxiosInstance"; 

// Get feeds
export const getFeeds = async (page = 1) => {
  try {
    const res = await axios.get(`/post/getFeeds`,{
        page
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching feeds:", error);
    return null;
  }
};

// Like post
export const likePost = async (postId) => {
  try {
    console.log(postId , "inside add like api call");
    const res = await axios.post(`/like/add`,{
      postId
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error liking post:", error);
    return null;
  }
};

export const removeLike = async (postId) => {
  try {
    await axios.delete(`/like/remove`, {
      data: { postId },
      withCredentials: true
    });
    return true;
  } catch (error) {
    console.error("Error removing like:", error);
    return null;
  }
};

// Follow user
export const followUser = async (followingId) => {
  try {
        console.log(followingId , "inside add follow api call");
    const res = await axios.post(`/follow/add`,{
      followingId
    });
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.error("Error following user:", error);
    return null;
  }
};
export const unFollowUser = async (followingId) => {
  try {
    await axios.delete("follow/remove", {
      data: { followingId },
      withCredentials: true
    });
    console.log("Unfollow success");
  } catch (err) {
    console.error("Error unfollowing user:", err);
  }
};

export const getFollowers = async () => {
  const res = await axios.get("/follow/followers");
  return res.data;
};

export const getFollowing = async () => {
  const res = await axios.get("/follow/following");
  return res.data;
};

export const searchPosts = async (
  searchTerm,
  { filterBy = "caption", sortOrder = "DESC", page = 1, limit = 50 } = {}
) => {
  const res = await axios.post("/post/search", {
    searchTerm,
    filterBy,
    sortOrder,
    page,
    limit,
  });
  return res.data;
};