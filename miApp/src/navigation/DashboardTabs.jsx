import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";

export default function Dashboard({ navigation }) {
  return (
    <View style={styles.container}>
      <Card style={styles.heroCard}>
        <Card.Content>
          <Text style={styles.heroTitle}>📊 Panel Principal</Text>
          <Text style={styles.heroSubtitle}>
            Bienvenida, aquí gestionas todos tus eventos
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>🎉 Crear Evento</Text>
          <Text style={styles.cardText}>
            Registra un nuevo cumpleaños o graduación.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("CreateEventScreen")}
          >
            ➕ Crear
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>📋 Lista de Eventos</Text>
          <Text style={styles.cardText}>
            Consulta todos los eventos registrados.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("EventsScreen")}
          >
            📂 Ver Lista
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>✏️ Editar Evento</Text>
          <Text style={styles.cardText}>
            Modifica los detalles de un evento existente.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate("EditEventScreen", { eventId: 1 }) // ejemplo
            }
          >
            🔧 Editar
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  heroCard: { marginBottom: 20 },
  heroTitle: { fontSize: 22, fontWeight: "bold" },
  heroSubtitle: { fontSize: 14, color: "#666" },
  card: { marginBottom: 15 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  cardText: { fontSize: 14, marginVertical: 5 },
});
