import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import apiClient from "../services/apiClient";

export default function EventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  // ================= CARGAR EVENTOS =================
  const fetchEvents = async () => {
    try {
      const response = await apiClient.get("/eventos");
      setEvents(response.data); // tu API devuelve un array de eventos
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ================= ELIMINAR EVENTO =================
  const deleteEvent = async (id) => {
    Alert.alert(
      "Eliminar evento",
      "¿Seguro que deseas eliminar este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await apiClient.delete(`/eventos/${id}`);
              Alert.alert("✅ Evento eliminado");
              fetchEvents(); // recargar lista
            } catch (error) {
              console.error(error.response?.data || error.message);
              Alert.alert("❌ Error al eliminar evento");
            }
          },
        },
      ]
    );
  };

  // ================= RENDER ITEM =================
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{item.presetTitle}</Text>
        <Text>📅 Fecha: {item.date}</Text>
        <Text>👤 Organizador: {item.organizer}</Text>
        <Text>🏛 Salón: {item.hall}</Text>
        <Text>👥 Invitados: {item.guests}</Text>
        <Text>💰 Total: ${item.totalGeneral}</Text>
        {item.extras && <Text>✨ Extras: {item.extras}</Text>}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigation.navigate("EditEvent", { event: item })}>
          ✏️ Editar
        </Button>
        <Button onPress={() => deleteEvent(item.id)} textColor="red">
          🗑 Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No hay eventos registrados</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { marginBottom: 15 },
  title: { fontSize: 18, fontWeight: "bold" },
});
