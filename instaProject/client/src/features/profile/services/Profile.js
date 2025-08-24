import axiosInstance from "../../../AxiosInstance"; 

export const searchUsers = async (searchData) => {
  try {
    const body = {};
    Object.keys(searchData).forEach((key) => {
      if (searchData[key] !== "" && searchData[key] !== undefined) {
        body[key] = searchData[key];
      }
    });

    console.log("Request Body:", body);

    const response = await axiosInstance.post("/users/search", body);

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Search error:", error.response?.data || error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
