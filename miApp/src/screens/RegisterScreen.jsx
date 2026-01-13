import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Snackbar } from "react-native-paper";
import { useAppContext } from "../context/AppContext";
import apiClient from "../services/apiClient";

export default function RegisterScreen({ navigation }) {
  const { login } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Completa todos los campos");
      return;
    }
    login({ name, email });
    navigation.replace("Dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Crear Cuenta</Text>

      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        mode="outlined"
        secureTextEntry
      />

      {error !== "" && <Text style={styles.error}>{error}</Text>}
      {success !== "" && <Text style={styles.success}>{success}</Text>}

      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Registrarse
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.replace("Login")}
        style={styles.link}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
  link: { marginTop: 10 },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  success: { color: "green", marginBottom: 10, textAlign: "center" },
});
