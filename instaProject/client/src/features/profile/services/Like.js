import axiosInstance from "../../../AxiosInstance";

export const getUserLikes = async ({ page = 1, limit = 20 } = {}) => {
  try {
    const res = await axiosInstance.get(`like/getUserLikes`, {
      params: { page, limit }
    });
    return res.data; // { totalLikes, totalPages, page, limit, likes }
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return { totalLikes: 0, totalPages: 0, page, limit, likes: [] };
  }
};
