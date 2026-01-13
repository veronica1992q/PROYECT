import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";

const apiClient = axios.create({
  baseURL: API_URL + "/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Agregar el token de autenticación a cada solicitud
apiClient.interceptors.request.use ( async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
