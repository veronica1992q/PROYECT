import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { useAppContext } from "../context/AppContext";

export default function HomeScreen({ navigation }) {
  const { user } = useAppContext();

  return (
    <ScrollView style={styles.container}>
      {/* Encabezado */}
      <Text style={styles.header}>
        🎉 ¡Transforma tu fiesta en un evento inolvidable, {user?.name || "Invitado"}! 🎊
      </Text>

      {/* Bloque de tipos de eventos */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Celebraciones principales:</Text>
          <Text style={styles.item}>🎂 Cumpleaños</Text>
          <Text style={styles.item}>🎓 Graduaciones</Text>
        </Card.Content>
      </Card>

      {/* Bloque de servicios */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Nuestros servicios:</Text>
          <Text style={styles.item}>🎈 Arreglos de globos</Text>
          <Text style={styles.item}>🌸 Centros de mesa</Text>
          <Text style={styles.item}>🪑 Alquiler de sillas, mesas y sillón trono</Text>
        </Card.Content>
      </Card>

      {/* Mensaje motivador */}
      <Text style={styles.message}>
        ✨ ¡Haz que tu evento brille sin romper tu presupuesto! ✨
      </Text>

      {/* Botón rápido */}
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate("CreateEvent")}
      >
        Crear Evento
      </Button>

      {/* Nota final */}
      <Text style={styles.note}>
        📞 Reserva tu decoración con anticipación para asegurar disponibilidad.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#1976d2" },
  card: { marginBottom: 15, borderRadius: 10, backgroundColor: "#fff", elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#333" },
  item: { fontSize: 14, marginBottom: 4, color: "#555" },
  message: { fontSize: 16, textAlign: "center", marginVertical: 15, color: "#444" },
  button: { alignSelf: "center", backgroundColor: "#1976d2", paddingHorizontal: 30, borderRadius: 8 },
  note: { fontSize: 13, textAlign: "center", marginTop: 20, color: "#777" },
});
