import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, Card, Checkbox } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
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

  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showGraduationPicker, setShowGraduationPicker] = useState(false);

  // Organizadores (5 distintos por tipo)
  const birthdayOrganizers = [
    "Ana Morales",
    "Luis Pérez",
    "Carla Gómez",
    "Fernando Ruiz",
    "Patricia León",
  ];
  const graduationOrganizers = [
    "Daniel Ortega",
    "Laura Sánchez",
    "Martín Herrera",
    "Claudia Jiménez",
    "Roberto Castillo",
  ];

  // Salones (5 distintos por tipo)
  const birthdayHalls = [
    "Salón Fiesta",
    "Salón Alegría",
    "Salón Infantil",
    "Salón Diversión",
    "Salón Magia",
  ];
  const graduationHalls = [
    "Salón Gala",
    "Salón Éxito",
    "Salón Honor",
    "Salón Triunfo",
    "Salón Victoria",
  ];

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

  // Cálculo de total
  const calculateTotal = (services, selected) =>
    selected.reduce((sum, s) => {
      const item = services.find((i) => i.name === s);
      return sum + (item?.price || 0);
    }, 0);

  // Toggle servicio
  const toggleService = (setState, serviceName) => {
    setState((prev) => {
      const already = prev.services.includes(serviceName);
      const updated = already
        ? prev.services.filter((s) => s !== serviceName)
        : [...prev.services, serviceName];
      return { ...prev, services: updated };
    });
  };

  // Crear evento
  const handleCreate = async (type, data, services) => {
    if (!data.date || !data.organizer || !data.hall) {
      alert("Por favor completa fecha, organizador y salón");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/events`, {
        presetTitle: type === "cumpleaños" ? "🎂 Feliz Cumpleaños" : "🎓 Graduación",
        offers: data.services,
        total: calculateTotal(services, data.services),
        ...data,
      });
      alert(`${type === "cumpleaños" ? "Cumpleaños" : "Graduación"} creado ✅`);
      navigation?.navigate?.("Events");
    } catch (err) {
      console.error("Error creando evento:", err.response?.data || err.message);
      alert("No se pudo crear el evento");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✨ Crear Evento ✨</Text>

      {/* Cumpleaños */}
      <Card style={styles.card}>
        <Card.Title title="🎂 Fiesta de Cumpleaños" />
        <Card.Content>
          <Text style={styles.sectionTitle}>Servicios disponibles</Text>
          {birthdayServices.map((item, i) => (
            <Checkbox.Item
              key={i}
              label={`${item.name} ($${item.price})`}
              status={birthday.services.includes(item.name) ? "checked" : "unchecked"}
              onPress={() => toggleService(setBirthday, item.name)}
            />
          ))}

          <Text style={styles.label}>Fecha</Text>
          <Button
            mode="outlined"
            onPress={() => setShowBirthdayPicker(true)}
            style={styles.dateButton}
          >
            {birthday.date ? `📅 ${birthday.date}` : "Seleccionar fecha"}
          </Button>
          {showBirthdayPicker && (
            <DateTimePicker
              value={birthday.date ? new Date(birthday.date) : new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowBirthdayPicker(false);
                if (selectedDate) {
                  const formatted = selectedDate.toISOString().split("T")[0];
                  setBirthday((prev) => ({ ...prev, date: formatted }));
                }
              }}
            />
          )}

          <Text style={styles.label}>Organizador</Text>
          <Picker
            selectedValue={birthday.organizer}
            onValueChange={(v) => setBirthday((prev) => ({ ...prev, organizer: v }))}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un organizador" value="" />
            {birthdayOrganizers.map((org, i) => (
              <Picker.Item key={i} label={org} value={org} />
            ))}
          </Picker>

          <Text style={styles.label}>Salón de eventos</Text>
          <Picker
            selectedValue={birthday.hall}
            onValueChange={(v) => setBirthday((prev) => ({ ...prev, hall: v }))}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un salón" value="" />
            {birthdayHalls.map((h, i) => (
              <Picker.Item key={i} label={h} value={h} />
            ))}
          </Picker>

          <TextInput
            label="Extras"
            value={birthday.extras}
            onChangeText={(v) => setBirthday((prev) => ({ ...prev, extras: v }))}
            style={styles.input}
            mode="outlined"
            multiline
          />

          <Text style={styles.total}>
            Total: ${calculateTotal(birthdayServices, birthday.services)}
          </Text>

          <Button
            mode="contained"
            style={styles.createButton}
            onPress={() => handleCreate("cumpleaños", birthday, birthdayServices)}
          >
            Crear Cumpleaños
          </Button>
        </Card.Content>
      </Card>

      {/* Graduación */}
      <Card style={styles.card}>
        <Card.Title title="🎓 Graduación" />
        <Card.Content>
          <Text style={styles.sectionTitle}>Servicios disponibles</Text>
          {graduationServices.map((item, i) => (
            <Checkbox.Item
              key={i}
              label={`${item.name} ($${item.price})`}
              status={graduation.services.includes(item.name) ? "checked" : "unchecked"}
              onPress={() => toggleService(setGraduation, item.name)}
            />
          ))}

          <Text style={styles.label}>Fecha</Text>
          <Button
            mode="outlined"
            onPress={() => setShowGraduationPicker(true)}
            style={styles.dateButton}
          >
            {graduation.date ? `📅 ${graduation.date}` : "Seleccionar fecha"}
          </Button>
          {showGraduationPicker && (
            <DateTimePicker
              value={graduation.date ? new Date(graduation.date) : new Date()}
              mode="date"
              display="default"
              minimumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowGraduationPicker(false);
                if (selectedDate) {
                  const formatted = selectedDate.toISOString().split("T")[0];
                  setGraduation((prev) => ({ ...prev, date: formatted }));
                }
              }}
            />
          )}

          <Text style={styles.label}>Organizador</Text>
          <Picker
            selectedValue={graduation.organizer}
            onValueChange={(v) => setGraduation((prev) => ({ ...prev, organizer: v }))}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un organizador" value="" />
            {graduationOrganizers.map((org, i) => (
              <Picker.Item key={i} label={org} value={org} />
            ))}
          </Picker>

          <Text style={styles.label}>Salón de eventos</Text>
          <Picker
            selectedValue={graduation.hall}
            onValueChange={(v) => setGraduation((prev) => ({ ...prev, hall: v }))}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un salón" value="" />
            {graduationHalls.map((h, i) => (
              <Picker.Item key={i} label={h} value={h} />
            ))}
          </Picker>

          <TextInput
            label="Extras"
            value={graduation.extras}
            onChangeText={(v) => setGraduation((prev) => ({ ...prev, extras: v }))}
            style={styles.input}
            mode="outlined"
            multiline
          />

          <Text style={styles.total}>
            Total: ${calculateTotal(graduationServices, graduation.services)}
          </Text>

          <Button
            mode="contained"
            style={styles.createButton}
            onPress={() => handleCreate("graduacion", graduation, graduationServices)}
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
    marginBottom: 20,
    textAlign: "center",
    color: "#1976d2",
  },
  card: { marginBottom: 20, borderRadius: 10, backgroundColor: "#fff", elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#333" },
  label: { marginTop: 10, fontSize: 15, fontWeight: "bold", color: "#444" },
  picker: { marginBottom: 15, backgroundColor: "#fff", borderRadius: 6 },
  input: { marginBottom: 15 },
  dateButton: { marginBottom: 15, borderColor: "#1976d2" },
  total: { fontSize: 16, fontWeight: "bold", textAlign: "center", marginVertical: 10, color: "#1976d2" },
  createButton: {
    marginTop: 10,
    alignSelf: "center",
    backgroundColor: "#1976d2",
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
