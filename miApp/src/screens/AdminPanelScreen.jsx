import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Card, Button, Divider } from "react-native-paper";
import { useAppContext } from "../context/AppContext";

export default function AdminPanelScreen({ navigation }) {
  const { user } = useAppContext();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Panel de Administrador</Text>
          <Divider style={{ marginVertical: 10 }} />
          <Text style={styles.subtitle}>Bienvenido, {user?.name || "Administrador"}</Text>
          <Text style={styles.info}>Aquí puedes gestionar usuarios, eventos y ver estadísticas.</Text>
        </Card.Content>
      </Card>
      {/* Aquí puedes agregar más opciones administrativas */}
      <Button
        mode="contained"
        style={styles.button}
        icon="account-multiple"
        onPress={() => navigation.navigate("UserManagement")}
      >
        Gestionar Usuarios
      </Button>
      <Button
        mode="outlined"
        style={styles.button}
        icon="calendar"
        onPress={() => navigation.navigate("Events")}
      >
        Ver Todos los Eventos
      </Button>
      {/* Puedes agregar más botones según lo que necesites */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
  button: {
    marginVertical: 8,
  },
});
