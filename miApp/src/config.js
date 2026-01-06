// src/config.js
import { Platform } from "react-native";

const getApiUrl = () => {
  if (Platform.OS === "web") {
    return "http://localhost:3000"; // navegador web
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000"; // emulador Android
  }
  // Para iOS o dispositivos físicos, usa la IP de tu máquina (ej. http://192.168.1.100:3000)
  return "http://192.168.1.100:3000";
};

export const API_URL = getApiUrl();
