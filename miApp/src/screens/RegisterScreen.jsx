import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Snackbar, Card } from "react-native-paper";
import apiClient from "../services/apiClient";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      // ✅ CORREGIDO → usar /api/register porque está en routes/api.php
      await apiClient.post("/api/register", {
        name,
        email,
        password,
      });

      // Después de registrarse, ir al login
      navigation.replace("Login");

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
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>📝 Crear Cuenta</Text>

          <TextInput
            label="Nombre"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
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
            mode="contained"
            style={{ marginTop: 18, backgroundColor: "#1976d2" }}
            onPress={() => navigation.replace("Login")}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Button>
        </Card.Content>
      </Card>

      <Snackbar visible={!!error} onDismiss={() => setError("")} duration={3000}>
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 22,
    backgroundColor: "#f5f6fa",
  },
  card: {
    paddingVertical: 18,
    paddingHorizontal: 12,
    elevation: 5,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    marginBottom: 14,
  },
  button: {
    marginTop: 8,
  },
});
