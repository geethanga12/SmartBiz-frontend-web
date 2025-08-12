// // src/service/AxiosOrder.jsx


import axios from "axios";

// baseURL: backend root
const instance = axios.create({
  baseURL: "http://localhost:8080",
  // note: don't set a static Authorization header here
});

// attach token to each request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("user-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// global response handler - handle 401s centrally
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // clear session and force-login
      localStorage.removeItem("user-token");
      localStorage.removeItem("user-role");
      localStorage.removeItem("user-email");
      // use a hard redirect so React Router resets reliably
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default instance;



// src/service/AxiosOrder.jsx
// import axios from "axios";

// // baseURL should point to your backend root (not /api) because auth lives at /auth
// const instance = axios.create({
//   baseURL: "http://localhost:8080",
//   // DON'T set Authorization here with a static value (will be stale).
// });

// // Add request interceptor to attach fresh token from localStorage
// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("user-token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   } else {
//     delete config.headers.Authorization;
//   }
//   return config;
// });

// export default instance;
