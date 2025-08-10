import axios from "axios";
const BEARER_TOKEN = localStorage.getItem("user-token");

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
});

export default instance;