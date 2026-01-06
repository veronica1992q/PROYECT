import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
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
    guests: "",
    budget: "",
  });

  const [graduation, setGraduation] = useState({
    date: "",
    organizer: "",
    hall: "",
    extras: "",
    guests: "",
    budget: "",
  });

  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showGraduationPicker, setShowGraduationPicker] = useState(false);

  // Funciones para limpiar formularios
  const resetBirthday = () => {
    setBirthday({
      date: "",
      organizer: "",
      hall: "",
      extras: "",
      guests: "",
      budget: "",
    });
  };

  const resetGraduation = () => {
    setGraduation({
      date: "",
      organizer: "",
      hall: "",
      extras: "",
      guests: "",
      budget: "",
    });
  };

  // Organizadores ficticios
  const organizers = [
    "Miguel Andrade",
    "Sofía Herrera",
    "Carlos Méndez",
    "Valeria Torres",
    "Javier Ríos",
    "Camila Paredes",
    "Andrés Guzmán",
    "Mariana López",
    "Diego Salazar",
    "Paola Castillos",
  ];

  // Salones ficticios
  const halls = [
    "Salón Crystal",
    "Salón Diamante",
    "Salón Oro",
    "Salón Plata",
    "Salón Esmeralda",
    "Salón Rubí",
    "Salón Zafiro",
    "Salón Topacio",
    "Salón Jade",
    "Salón Amatista",
  ];

  // Ofertas por tipo
  const offers = {
    cumpleaños: [
      "Decoración temática",
      "Pastel personalizado",
      "Animación infantil",
      "Fotografía",
    ],
    graduacion: [
      "Decoración elegante",
      "Catering completo",
      "DJ y música",
      "Fotografía profesional",
    ],
  };

  const handleCreate = async (type, data) => {
    if (!data.date || !data.organizer || !data.hall) {
      alert("Por favor completa fecha, organizador y salón");
      return;
    }
    try {
      await axios.post(`${API_URL}/api/events`, {
        presetTitle:
          type === "cumpleaños" ? "🎂 Feliz Cumpleaños" : "🎓 Graduación",
        offers: offers[type] ?? [],
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
            <Text key={i} style={styles.offerItem}>
              • {item}
            </Text>
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
              display="calendar"
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
            {organizers.map((org, i) => (
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
            {halls.map((h, i) => (
              <Picker.Item key={i} label={h} value={h} />
            ))}
          </Picker>

          <Text style={styles.label}>Número de invitados:</Text>
          <TextInput
            label="Invitados"
            value={birthday.guests}
            onChangeText={(v) => setBirthday({ ...birthday, guests: v })}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Presupuesto estimado:</Text>
          <TextInput
            label="Presupuesto"
            value={birthday.budget}
            onChangeText={(v) => setBirthday({ ...birthday, budget: v })}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
          />

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

          <Button
            mode="outlined"
            style={styles.resetButton}
            onPress={resetBirthday}
          >
            Limpiar Cumpleaños
          </Button>
        </Card.Content>
      </Card>

      {/* Bloque Graduación */}
      <Card style={styles.card}>
        <Card.Title title="🎓 Graduación" />
        <Card.Content>
          <Text style={styles.offersTitle}>Lo que ofrecemos:</Text>
          {offers.graduacion.map((item, i) => (
            <Text key={i} style={styles.offerItem}>
              • {item}
            </Text>
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
              display="calendar"
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
            {organizers.map((org, i) => (
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
            {halls.map((h, i) => (
              <Picker.Item key={i} label={h} value={h} />
            ))}
          </Picker>

          <Text style={styles.label}>Número de invitados:</Text>
          <TextInput
            label="Invitados"
            value={graduation.guests}
            onChangeText={(v) => setGraduation({ ...graduation, guests: v })}