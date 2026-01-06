import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAppContext } from "../context/AppContext";

export default function EditEventScreen({ route, navigation }) {
  const { user } = useAppContext();
  const { event } = route.params;

  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [error, setError] = useState("");

  // 🔒 Seguridad: solo el dueño puede editar
  if (user.role !== "user" || event.user_id !== user.id) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No tienes permiso para editar este evento</Text>
      </View>
    );
  }

  const handleUpdate = () => {
    if (!title || !date) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // 🔧 AQUÍ irá el PUT al backend
    console.log("Evento actualizado:", { title, date });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Editar Evento</Text>

      <TextInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Fecha"
        value={date}
        onChangeText={setDate}
        style={styles.input}
        mode="outlined"
      />

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Button mode="contained" onPress={handleUpdate} style={styles.button}>
        Guardar Cambios
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { marginBottom: 15 },
  button: { backgroundColor: "#1976d2" },
  error: { color: "red", textAlign: "center", marginBottom: 10 },
});
