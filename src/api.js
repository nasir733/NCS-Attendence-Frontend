import axios from "axios";
const base_url = `${process.env.REACT_APP_API_URL}`;


export const axiosInstance = axios.create({
  baseURL: base_url,
  headers: {
    Authorization: localStorage.getItem("access")
      ? "JWT " + localStorage.getItem("access")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
  },
});
