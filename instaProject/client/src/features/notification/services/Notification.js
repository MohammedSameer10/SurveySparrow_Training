import axiosInstance from "../../../AxiosInstance";

export const getNotifications = async () => {
  const res = await axiosInstance.get("/notification/get");
  return res.data;
};

export const updateNotification = async (id) => {
  const res = await axiosInstance.put(`/notification/update/${id}`);
  return res.data;
};
