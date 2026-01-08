import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, FlatList } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import axios from "axios";
import { API_URL } from "../config";

export default function EventsScreen({ navigation }) {
  const { user } = useAppContext();
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      if (!user?.email) {
        setEvents([]);
        return;
      }
      const res = await axios.get(`${API_URL}/api/events?user_email=${user.email}`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error cargando eventos:", err.response?.data || err.message);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/events/${id}`);
      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      console.error("Error eliminando evento:", err.response?.data || err.message);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.presetTitle} />
      <Card.Content>
        <Text style={styles.detail}>👤 Organizador: {item.organizer}</Text>
        <Text style={styles.detail}>🏛️ Salón: {item.hall}</Text>
        <Text style={styles.detail}>📅 Fecha: {item.date}</Text>
        {item.extras ? <Text style={styles.detail}>✨ Extras: {item.extras}</Text> : null}
        {item.offers && item.offers.length > 0 && (
          <View style={styles.offersBox}>
            <Text style={styles.offersTitle}>Lo que ofrecemos:</Text>
            {item.offers.map((offer, i) => (
              <Text key={i} style={styles.offerItem}>• {offer}</Text>
            ))}
          </View>
        )}
        <Button
          mode="contained"
          style={styles.deleteButton}
          onPress={() => deleteEvent(item.id)}
        >
          Eliminar
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📋 Mis Eventos</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No tienes eventos creados aún</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: { marginBottom: 16, borderRadius: 12, backgroundColor: "#fff", elevation: 2 },
  detail: { fontSize: 14, marginBottom: 6 },
  offersBox: { marginTop: 10, padding: 8, backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 6 },
  offersTitle: { fontWeight: "bold", marginBottom: 4 },
  offerItem: { fontSize: 13, marginBottom: 2 },
  deleteButton: { marginTop: 10, backgroundColor: "#d32f2f" },
  empty: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#777" },
});
