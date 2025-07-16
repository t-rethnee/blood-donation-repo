import axios from "axios";
 
const axiosSecure = axios.create({
  baseURL: "https://blood-donation-server-iota-flame.vercel.app/api",
});

export default axiosSecure;
