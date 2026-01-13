import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Card, Avatar } from "react-native-paper";
import { useAppContext } from "../context/AppContext";

export default function HomeScreen({ navigation }) {
  const { user } = useAppContext();

  return (
    <ScrollView style={styles.container}>
      {/* Perfil */}
      <View style={styles.profileBox}>
        <Avatar.Text
          size={55}
          label={user?.name?.charAt(0) || "U"}
          style={{ backgroundColor: "#1976d2" }}
        />
        <Text style={styles.welcome}>Bienvenido/a</Text>
      </View>

      {/* Encabezado */}
      <Text style={styles.header}>
        🎉 ¡Transforma tu fiesta en un evento inolvidable, {user?.name || "Invitado"}! 🎊
      </Text>

      {/* Acciones rápidas */}
      <View style={styles.quickActions}>
        <Button
          mode="contained"
          style={styles.mainButton}
          onPress={() => navigation.navigate("CreateEvent")}
        >
          ➕ Crear Evento
        </Button>

        <Button
          mode="outlined"
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Events")}
        >
          📋 Ver Mis Eventos
        </Button>

        <Button
          mode="contained"
          style={{marginTop: 16, backgroundColor: '#43a047', width: '100%', alignSelf: 'center', paddingVertical: 8}}
          labelStyle={{fontSize: 16, fontWeight: 'bold'}}
          onPress={() => navigation.navigate("Register")}
        >
          📝 Registrarse
        </Button>
      </View>

      {/* Tipos de eventos */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Celebraciones principales</Text>
          <Text style={styles.item}>🎂 Cumpleaños</Text>
          <Text style={styles.item}>🎓 Graduaciones</Text>
          
        </Card.Content>
      </Card>

      {/* Servicios */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Nuestros servicios</Text>
          <Text style={styles.item}>🎈 Arreglos de globos</Text>
          <Text style={styles.item}>🌸 Centros de mesa</Text>
          <Text style={styles.item}>🪑 Alquiler de mobiliario</Text>
        </Card.Content>
      </Card>

      {/* Promoción */}
      <Card style={styles.promoCard}>
        <Card.Content>
          <Text style={styles.promoTitle}>🔥 Promoción del mes</Text>
          <Text>10% de descuento en decoración completa</Text>
        </Card.Content>
      </Card>

      {/* Mensaje */}
      <Text style={styles.message}>
        ✨ ¡Haz que tu evento brille sin romper tu presupuesto! ✨
      </Text>

      {/* Nota */}
      <Text style={styles.note}>
        📞 Reserva con anticipación para asegurar disponibilidad
      </Text>

      {/* Botón Registrarse al final */}
      <Button
        mode="contained"
        style={{marginTop: 30, backgroundColor: '#43a047', width: '100%', alignSelf: 'center', paddingVertical: 10}}
        labelStyle={{fontSize: 18, fontWeight: 'bold'}}
        onPress={() => navigation.navigate("Register")}
      >
        📝 Registrarse
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  profileBox: {
    alignItems: "center",
    marginBottom: 15,
  },
  welcome: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1976d2",
  },
  quickActions: {
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: "#1976d2",
    marginBottom: 10,
  },
  secondaryButton: {
    borderColor: "#1976d2",
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    marginBottom: 4,
  },
  promoCard: {
    backgroundColor: "#e3f2fd",
    marginBottom: 15,
  },
  promoTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 15,
  },
  note: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
    color: "#777",
  },
});
