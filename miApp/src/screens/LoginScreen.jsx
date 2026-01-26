import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, Snackbar, Card } from "react-native-paper";
import { useAppContext } from "../context/AppContext";
import apiClient from "../services/apiClient";

export default function LoginScreen({ navigation }) {
  const { login } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña");
      return;
    }

    try {
      setLoading(true);

      // 🔥 AQUÍ EL CAMBIO IMPORTANTE → SIN /api
      const { data } = await apiClient.post("/login", {
        email,
        password,
      });

      await login(data.user, data.token);

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
        setError("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>🔐 Iniciar sesión</Text>

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
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            style={styles.button}
          >
            Entrar
          </Button>

          <Button
            mode="contained"
            style={{ marginTop: 18, backgroundColor: "#43a047" }}
            onPress={() => navigation.replace("Register")}
          >
            ¿No tienes cuenta? Regístrate
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
