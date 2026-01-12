import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ⚠️ IMPORTANTE: agrega /api al final
// Cambia TU_IP_O_DOMINIO por tu IP real
const API_URL = "http://localhost:8000/api";

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// 🔐 Interceptor para agregar el token automáticamente
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;

