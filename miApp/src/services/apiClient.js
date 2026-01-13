import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
  baseURL: "http://10.82.17.236:8000", // IP local de tu backend
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
