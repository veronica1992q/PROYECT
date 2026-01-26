import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ⚠️ Cambia esta IP por la de tu PC en la red local (ipconfig → IPv4)
const LOCAL_IP = "10.82.23.224"; 
const PORT = "8000";

const apiClient = axios.create({
  baseURL: Platform.OS === "web"
    ? `http://localhost:${PORT}/api`
    : `http://${LOCAL_IP}:${PORT}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Agregar el token de autenticación a cada solicitud
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Error leyendo token:", error);
  }
  return config;
});

export default apiClient;

