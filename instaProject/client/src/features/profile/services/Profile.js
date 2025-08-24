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


export const downloadUserCSV = async () => {
  const response = await axiosInstance.get("/users/getUserData", {
    responseType: "blob"
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "my_data.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();
};
