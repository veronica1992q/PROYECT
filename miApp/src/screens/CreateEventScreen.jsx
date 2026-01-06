import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, Card, Checkbox } from "react-native-paper";
import axios from "axios";
import { API_URL } from "../config";

export default function CreateEventScreen({ navigation }) {
  const [birthday, setBirthday] = useState({
    date: "",
    organizer: "",
    hall: "",
    extras: "",
    services: [],
  });

  const [graduation, setGraduation] = useState({
    date: "",
    organizer: "",
    hall: "",
    extras: "",
    services: [],
  });

  // Servicios con precios
  const birthdayServices = [
    { name: "Decoración temática", price: 40 },
    { name: "Pastel personalizado", price: 25 },
    { name: "Animación infantil", price: 50 },
    { name: "Fotografía", price: 30 },
  ];

  const graduationServices = [
    { name: "Decoración elegante", price: 60 },
    { name: "Catering completo", price: 100 },
    { name: "DJ y música", price: 80 },
    { name: "Fotografía profesional", price: 50 },
  ];

  // Calcular total
  const calculateTotal = (services, selected) =>
    selected.reduce((sum, s) => {
      const item = services.find((i) => i.name === s);
      return sum + (item?.price || 0);
    }, 0);

  // Activar / desactivar servicios
  const toggleService = (setState, serviceName) => {
    setState((prev) => {
      const exists = prev.services.includes(serviceName);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== serviceName)
          : [...prev.services, serviceName],
      };
    });
  };

  // Crear evento
  const handleCreate = async (type, data, services) => {
    if (!data.date || !data.organizer || !data.hall) {
      alert("Completa fecha, organizador y salón");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/events`, {
        presetTitle: type === "cumpleaños" ? "🎂 Feliz Cumpleaños" : "🎓 Graduación",
        offers: data.services,
        total: calculateTotal(services, data.services),
        ...data,
      });

      alert("Evento creado correctamente ✅");
      navigation?.navigate?.("Events");
    } catch (error) {
      console.error(error);
      alert("Error al crear el evento");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✨ Crear Evento ✨</Text>

      {/* 🎂 Cumpleaños */}
      <Card style={styles.card}>
        <Card.Title title="🎂 Fiesta de Cumpleaños" />
        <Card.Content>
          {birthdayServices.map((item, i) => (
            <Checkbox.Item
              key={i}
              label={`${item.name} ($${item.price})`}
              status={birthday.services.includes(item.name) ? "checked" : "unchecked"}
              onPress={() => toggleService(setBirthday, item.name)}
            />
          ))}

          <TextInput
            label="Fecha (YYYY-MM-DD)"
            value={birthday.date}
            onChangeText={(v) => setBirthday({ ...birthday, date: v })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Organizador"
            value={birthday.organizer}
            onChangeText={(v) => setBirthday({ ...birthday, organizer: v })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Salón de eventos"
            value={birthday.hall}
            onChangeText={(v) => setBirthday({ ...birthday, hall: v })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Extras"
            value={birthday.extras}
            onChangeText={(v) => setBirthday({ ...birthday, extras: v })}
            mode="outlined"
            multiline
            style={styles.input}
          />

          <Text style={styles.total}>
            Total: ${calculateTotal(birthdayServices, birthday.services)}
          </Text>

          <Button
            mode="contained"
            onPress={() => handleCreate("cumpleaños", birthday, birthdayServices)}
            style={styles.createButton}
          >
            Crear Cumpleaños
          </Button>
        </Card.Content>
      </Card>

      {/* 🎓 Graduación */}
      <Card style={styles.card}>
        <Card.Title title="🎓 Graduación" />
        <Card.Content>
          {graduationServices.map((item, i) => (
            <Checkbox.Item
              key={i}
              label={`${item.name} ($${item.price})`}
              status={graduation.services.includes(item.name) ? "checked" : "unchecked"}
              onPress={() => toggleService(setGraduation, item.name)}
            />
          ))}

          <TextInput
            label="Fecha (YYYY-MM-DD)"
            value={graduation.date}
            onChangeText={(v) => setGraduation({ ...graduation, date: v })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Organizador"
            value={graduation.organizer}
            onChangeText={(v) => setGraduation({ ...graduation, organizer: v })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Salón de eventos"
            value={graduation.hall}
            onChangeText={(v) => setGraduation({ ...graduation, hall: v })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Extras"
            value={graduation.extras}
            onChangeText={(v) => setGraduation({ ...graduation, extras: v })}
            mode="outlined"
            multiline
            style={styles.input}
          />

          <Text style={styles.total}>
            Total: ${calculateTotal(graduationServices, graduation.services)}
          </Text>

          <Button
            mode="contained"
            onPress={() =>
              handleCreate("graduacion", graduation, graduationServices)
            }
            style={styles.createButton}
          >
            Crear Graduación
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1976d2",
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  input: { marginBottom: 15 },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#1976d2",
  },
  createButton: {
    marginTop: 10,
    backgroundColor: "#1976d2",
    borderRadius: 8,
  },
});