import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import apiClient from "../services/apiClient";

export default function EditEventScreen({ route, navigation }) {
  const { event } = route.params;
  const [updatedEvent, setUpdatedEvent] = useState(event);

  const updateEvent = async () => {
    try {
      await apiClient.put(`/eventos/${event.id}`, updatedEvent);
      alert("✅ Evento actualizado");
      navigation.navigate("Events");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("❌ Error al actualizar evento");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✏️ Editar Evento</Text>

      <TextInput
        label="Organizador"
        value={updatedEvent.organizer}
        onChangeText={(v) => setUpdatedEvent({ ...updatedEvent, organizer: v })}
        style={styles.input}
      />

      <TextInput
        label="Salón"
        value={updatedEvent.hall}
        onChangeText={(v) => setUpdatedEvent({ ...updatedEvent, hall: v })}
        style={styles.input}
      />

      <TextInput
        label="Fecha"
        value={updatedEvent.date}
        onChangeText={(v) => setUpdatedEvent({ ...updatedEvent, date: v })}
        style={styles.input}
      />

      <TextInput
        label="Invitados"
        value={String(updatedEvent.guests)}
        onChangeText={(v) =>
          setUpdatedEvent({ ...updatedEvent, guests: parseInt(v) || 0 })
        }
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        label="Extras"
        value={updatedEvent.extras || ""}
        onChangeText={(v) => setUpdatedEvent({ ...updatedEvent, extras: v })}
        style={styles.input}
      />

      <Button mode="contained" onPress={updateEvent} style={styles.button}>
        💾 Guardar Cambios
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 20 },
});
