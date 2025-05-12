import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api"
  // baseURL: "https://backend-amazonapi-rebu.onrender.com"
});
export { axiosInstance };
