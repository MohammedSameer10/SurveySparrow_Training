import axiosInstance from "../../../AxiosInstance";


export const addPost = async (data) => {
  try {
    console.log(data)
   const res = await  axiosInstance.post("/post/create", data, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials:true
  });
   console.log(res.data)
    console.log("Post added success");
    return res.data;
  } catch (err) {
    console.error("Error uploading  post:", err);
  }
};

export const getMyPosts = async (page = 1, limit = 20) => {
  try {
    const res = await axiosInstance.get("/post/getMyPost", {
      params: { page, limit },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching posts:", err);
    throw err;
  }
};


export const searchMyPosts = async (searchTerm) => {
  const res = await axiosInstance.post("/post/searchMyPost", {
    searchTerm
  });
  return res.data;
};

export const updateMyPost = async (postId, fields) => {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      form.append(key, value);
    }
  });
  const res = await axiosInstance.put(`/post/update/${postId}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true
  });
  return res.data;
};

export const deleteMyPost = async (postId) => {
  const res = await axiosInstance.delete(`/post/delete/${postId}`, {
    withCredentials: true
  });
  return res.data;
};
