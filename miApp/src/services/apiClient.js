import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
  baseURL: "http://10.82.23.224:8000/api", // ✅ SIN espacios y con /api
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// 🔐 Agregar token automáticamente
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
