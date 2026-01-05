// src/config.js
import { Platform } from "react-native";

const getApiUrl = () => {
  if (Platform.OS === "web") {
    return "http://localhost:3000"; // navegador web
  }
  if (Platform.OS === "android") {
    return "http://10.0.2.2:3000"; // emulador Android
  }
  if (Platform.OS === "ios") {
    return "http://localhost:3000"; // simulador iOS
  }
  // ⚠️ Para celular físico en la misma red, cambia por la IP de tu PC
  return "http://192.168.1.100:3000";
};

export const API_URL = getApiUrl();
