import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://44.202.218.119:3000/api"
  // baseURL: "https://backend-amazonapi-rebu.onrender.com"
});
export { axiosInstance };
