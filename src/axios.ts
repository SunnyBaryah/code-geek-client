import axios from "axios";
const API = axios.create({
  baseURL: "https://code-geek-server-seven.vercel.app/api/v1",
  // baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 25000,
});

// API.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // Request a new access token using the refresh token
//         const res = await axios.get("/api/v1/users/refresh-access-token", {
//           withCredentials: true,
//         });
//         console.log(res);
//         // Store the new access token
//         localStorage.setItem("accessToken", res.data.accessToken);

//         // Retry the failed request with the new token
//         originalRequest.headers[
//           "Authorization"
//         ] = `Bearer ${res.data.accessToken}`;
//         return API(originalRequest);
//       } catch (refreshError) {
//         console.log("Refresh token failed, logging out user.");
//         localStorage.removeItem("accessToken");
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default API;
