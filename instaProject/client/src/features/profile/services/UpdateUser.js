// services/UpdateUser.js
import axiosInstance from "../../../AxiosInstance"; 

export const updateUser = async (formData) => {
  try {
    console.log("Submitting FormData...");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await axiosInstance.put("/users/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Update success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error.response?.data || { message: "Something went wrong!" };
  }
};
