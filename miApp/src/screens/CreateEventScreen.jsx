import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { API_URL } from "../config";

export default function CreateEventScreen({ navigation }) {
  const [birthday, setBirthday] = useState({ date: "", organizer: "", hall: "", extras: "" });
  const [graduation, setGraduation] = useState({ date: "", organizer: "", hall: "", extras: "" });

  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showGraduationPicker, setShowGraduationPicker] = useState(false);

  // Organizadores (5 por tipo)
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

  // Salones (5 por tipo)
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

  // Ofertas por tipo
  const offers = {
    cumpleaños: ["Decoración temática", "Pastel personalizado", "Animación infantil", "Fotografía"],
    graduacion: ["Decoración elegante", "Catering completo", "DJ y música", "Fotografía profesional"],
  };

  const handleCreate = async (type, data) => {
    if (!data.date || !data.organizer || !data.hall) {
      alert("Por favor completa fecha, organizador y salón");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/events`, {
        presetTitle: type === "cumpleaños" ? "🎂 Feliz Cumpleaños" : "🎓 Graduación",
        offers: offers[type],
        ...data,
      });
      alert(`${type === "cumpleaños" ? "Cumpleaños" : "Graduación"} creado ✅`);
      navigation.navigate("Events");
    } catch (err) {
      console.error("Error creando evento:", err.response?.data || err.message);
      alert("No se pudo crear el evento");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✨ Crear Evento ✨</Text>

      {/* Bloque Cumpleaños */}
      <Card style={styles.card}>
        <Card.Title title="🎂 Fiesta de Cumpleaños" />
        <Card.Content>
          <Text style={styles.offersTitle}>Lo que ofrecemos:</Text>
          {offers.cumpleaños.map((item, i) => (
            <Text key={i} style={styles.offerItem}>• {item}</Text>
          ))}

          <Text style={styles.label}>Fecha:</Text>
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
                  setBirthday({ ...birthday, date: formatted });
                }
              }}
            />
          )}

          <Text style={styles.label}>Organizador:</Text>
          <Picker
            selectedValue={birthday.organizer}
            onValueChange={(v) => setBirthday({ ...birthday, organizer: v })}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un organizador" value="" />
            {birthdayOrganizers.map((org, i) => (
              <Picker.Item key={i} label={org} value={org} />
            ))}
          </Picker>

          <Text style={styles.label}>Salón de eventos:</Text>
          <Picker
            selectedValue={birthday.hall}
            onValueChange={(v) => setBirthday({ ...birthday, hall: v })}
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
            onChangeText={(v) => setBirthday({ ...birthday, extras: v })}
            style={styles.input}
            mode="outlined"
            multiline
          />

          <Button
            mode="contained"
            style={styles.createButton}
            onPress={() => handleCreate("cumpleaños", birthday)}
          >
            Crear Cumpleaños
          </Button>
        </Card.Content>
      </Card>

      {/* Bloque Graduación */}
      <Card style={styles.card}>
        <Card.Title title="🎓 Graduación" />
        <Card.Content>
          <Text style={styles.offersTitle}>Lo que ofrecemos:</Text>
          {offers.graduacion.map((item, i) => (
            <Text key={i} style={styles.offerItem}>• {item}</Text>
          ))}

          <Text style={styles.label}>Fecha:</Text>
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
                  setGraduation({ ...graduation, date: formatted });
                }
              }}
            />
          )}

          <Text style={styles.label}>Organizador:</Text>
          <Picker
            selectedValue={graduation.organizer}
            onValueChange={(v) => setGraduation({ ...graduation, organizer: v })}
            style={styles.picker}
          >
            <Picker.Item label="Selecciona un organizador" value="" />
            {graduationOrganizers.map((org, i) => (
              <Picker.Item key={i} label={org} value={org} />
            ))}
          </Picker>

          <Text style={styles.label}>Salón de eventos:</Text>
          <Picker
            selectedValue={graduation.hall}
            onValueChange={(v) => setGraduation({ ...graduation, hall: v })}
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
            onChangeText={(v) => setGraduation({ ...graduation, extras: v })}
            style={styles.input}
            mode="outlined"
            multiline
          />

          <Button
            mode="contained"
            style={styles.createButton}
            onPress={() => handleCreate("graduacion", graduation)}
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
  offersTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#333" },
  offerItem: { fontSize: 14, marginBottom: 4, color: "#555" },
  label: { marginTop: 10, fontSize: 15, fontWeight: "bold", color: "#444" },
  picker: { marginBottom: 15, backgroundColor: "#fff", borderRadius: 6 },
  input: { marginBottom: 15 },
  dateButton: {
    marginBottom: 15,
    borderColor: "#1976d2",
  },
  createButton: {
    marginTop: 10,
    alignSelf: "center",
    backgroundColor: "#1976d2",
    paddingHorizontal: 25,
    paddingVertical: 6,
    borderRadius: 8,
  },
});
