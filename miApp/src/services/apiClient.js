import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ baseURL SIN /api
const apiClient = axios.create({
  baseURL: "http://192.168.0.191:8000", 
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Agregar el token de autenticación a cada solicitud
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

