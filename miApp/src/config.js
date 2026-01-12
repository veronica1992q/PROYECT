// src/config.js
import { Platform } from "react-native";

const getApiUrl = () => {
  if (Platform.OS === "web") {
    return "http://127.0.0.1:8000"; // navegador web
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000"; // emulador Android
  }
  // Para iOS o dispositivos físicos, usa la IP de tu máquina (ej. http://192.168.1.100:8000)
  return "http:// 192.168.0.192:8000";
};

export const API_URL = getApiUrl();
