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
    return res.data;
  } catch (error) {
    console.error("Error liking post:", error);
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
    return res.data;
  } catch (error) {
    console.error("Error following user:", error);
    return null;
  }
};

export const unFollowUser = async (followingId) => {
  try {
    console.log(followingId, "inside remove follow api call");
    const res = await axios.post(`/follow/remove`, {
      followingId,
    });
    return res.data;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return null;
  }
};