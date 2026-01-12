import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Card, Divider, TextInput, Checkbox, Button } from "react-native-paper";
import apiClient from "../services/apiClient";
import { useAppContext } from "../context/AppContext";

export default function EditEventScreen({ route, navigation }) {
  const { user } = useAppContext();
  const { eventId } = route.params; // ID del evento a editar

  const [eventData, setEventData] = useState({
    fecha: "",
    anfitrion: "",
    lugar: "",
    invitados: 0,
    presupuesto: 0,
    extras: "",
    servicios: [],
  });

  // ================= CARGAR EVENTO =================
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiClient.get(`/eventos/${eventId}`);
        setEventData(response.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    };
    fetchEvent();
  }, [eventId]);

  // ================= ACTUALIZAR EVENTO =================
  const updateEvent = async () => {
    try {
      await apiClient.put(`/eventos/${eventId}`, {
        ...eventData,
        user_email: user?.email || "",
      });
      alert("✅ Evento actualizado con éxito");
      navigation.navigate("EventsScreen");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("❌ Error al actualizar el evento");
    }
  };

  // ================= UI =================
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.heroCard}>
        <Card.Content>
          <Text style={styles.heroTitle}>✏️ Editar Evento</Text>
          <Text style={styles.heroSubtitle}>Actualiza los detalles de tu evento</Text>
        </Card.Content>
      </Card>

      <TextInput
        label="📅 Fecha (YYYY-MM-DD)"
        value={eventData.fecha}
        onChangeText={(v) => setEventData({ ...eventData, fecha: v })}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="👤 Anfitrión"
        value={eventData.anfitrion}
        onChangeText={(v) => setEventData({ ...eventData, anfitrion: v })}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="🏛 Lugar"
        value={eventData.lugar}
        onChangeText={(v) => setEventData({ ...eventData, lugar: v })}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="👥 Invitados"
        value={String(eventData.invitados)}
        onChangeText={(v) =>
          setEventData({ ...eventData, invitados: parseInt(v.replace(/[^0-9]/g, ""), 10) || 0 })
        }
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />

      <TextInput
        label="💰 Presupuesto (USD)"
        value={String(eventData.presupuesto)}
        onChangeText={(v) =>
          setEventData({ ...eventData, presupuesto: parseInt(v.replace(/[^0-9]/g, ""), 10) || 0 })
        }
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
      />

      <TextInput
        label="✨ Extras"
        multiline
        value={eventData.extras}
        onChangeText={(v) => setEventData({ ...eventData, extras: v })}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" style={styles.updateButton} onPress={updateEvent}>
        💾 Guardar Cambios
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heroCard: { marginBottom: 20 },
  heroTitle: { fontSize: 20, fontWeight: "bold" },
  heroSubtitle: { fontSize: 14, color: "#666" },
  input: { marginBottom: 12 },
  updateButton: { marginTop: 20 },
});
