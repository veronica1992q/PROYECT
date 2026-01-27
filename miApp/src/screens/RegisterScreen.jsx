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
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      const response = await apiClient.post("/api/register", {
        name,
        email,
        password,
      });

      setSuccess("Registro exitoso 🎉");
      await login(response.data.user, response.data.token);
      navigation.replace("Dashboard");

    } catch (e) {
      if (e?.response?.data) {
        if (e.response.data.errors) {
          const mensajes = Object.values(e.response.data.errors).flat().join("\n");
          setError(mensajes);
        } else if (e.response.data.message) {
          setError(e.response.data.message);
        } else {
          setError(JSON.stringify(e.response.data));
        }
      } else {
        setError("No se pudo conectar con el servidor");
      }
    } finally {
      setLoading(false);
    }
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

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        style={styles.button}
      >
        Registrarse
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.replace("Login")}
        style={styles.link}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>

      <Snackbar visible={!!error} onDismiss={() => setError("")}>
        {error}
      </Snackbar>

      <Snackbar visible={!!success} onDismiss={() => setSuccess("")}>
        {success}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
  link: { marginTop: 10 },
});
