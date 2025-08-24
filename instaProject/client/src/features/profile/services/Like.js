import axiosInstance from "../../../AxiosInstance";

export const getUserLikes = async () => {
  try {
    const res = await axiosInstance.get(`like/getUserLikes`);
    console.log(res.data.likes);
    return res.data.likes;
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return [];
  }
};
