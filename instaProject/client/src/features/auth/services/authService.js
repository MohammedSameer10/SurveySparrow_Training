import api from "../../../AxiosInstance";
import Cookies from "js-cookie";

export const loginUser = async ({ email, password, login_type }) => {
  const res = await api.post("/users/login", {
    email,
    password,
    login_type,
  });

  if (res.status === 200) {
    const token = res.data.token;
    Cookies.set("jwt", token, {
      expires: 1, 
      secure: false, 
      sameSite: "Strict",
    });
  }

  return res;
};

export const registerUser = async ({ username, email, password }) => {
  const res = await api.post("/users/register", {
    username,
    email,
    password,
  });
  return res;
};
