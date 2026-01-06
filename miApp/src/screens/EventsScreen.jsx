import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import axios from "axios";
import { API_URL } from "../config";
import { useAppContext } from "../context/AppContext";

export default function EventsScreen({ navigation }) {
  const { user } = useAppContext();
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const url =
      user.role === "admin"
        ? `${API_URL}/api/events`
        : `${API_URL}/api/events?user_email=${user.email}`;

    const res = await axios.get(url);
    setEvents(res.data);
  };

  const deleteEvent = async (id) => {
    await axios.delete(`${API_URL}/api/events/${id}`);
    fetchEvents();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`${API_URL}/api/events/${id}`, { status });
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text>📅 {item.date}</Text>
        <Text>🏛️ {item.hall}</Text>
        <Text>👤 {item.user_email}</Text>
        <Text>📌 Estado: {item.status}</Text>

        {/* USUARIO: EDITAR */}
        {user.role === "user" && user.email === item.user_email && (
          <Button onPress={() => navigation.navigate("EditEvent", { event: item })}>
            Editar
          </Button>
        )}

        {/* ADMIN: APROBAR / RECHAZAR */}
        {user.role === "admin" && item.status === "pending" && (
          <>
            <Button onPress={() => updateStatus(item.id, "approved")}>
              Aprobar
            </Button>
            <Button onPress={() => updateStatus(item.id, "rejected")}>
              Rechazar
            </Button>
          </>
        )}

        {/* ADMIN: ELIMINAR */}
        {user.role === "admin" && (
          <Button onPress={() => deleteEvent(item.id)} color="red">
            Eliminar
          </Button>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  card: { margin: 10, padding: 10 },
});
