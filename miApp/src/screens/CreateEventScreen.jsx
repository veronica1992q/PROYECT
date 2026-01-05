import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import { TextInput, Button, Text, Card, Checkbox } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { API_URL } from "../config";

export default function CreateEventScreen({ navigation }) {
  const emptyEvent = {
    date: "",
    organizer: "",
    hall: "",
    extras: "",
    services: [],
    total: 0,
  };

  const [birthday, setBirthday] = useState({ ...emptyEvent });
  const [graduation, setGraduation] = useState({ ...emptyEvent });
  const [loading, setLoading] = useState(false);

  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [showGraduationPicker, setShowGraduationPicker] = useState(false);

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

  const servicesPrices = {
    "Decoración temática": 40,
    "Pastel personalizado": 25,
    "Animación infantil": 50,
    "Fotografía": 30,
    "Decoración elegante": 60,
    "Catering completo": 120,
    "DJ y música": 80,
    "Fotografía profesional": 50,
  };

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

  const calculateTotal = (services) =>
    services.reduce((sum, s) => sum + servicesPrices[s], 0);

  const toggleService = (type, service) => {
    const state = type === "cumpleaños" ? birthday : graduation;
    const setState = type === "cumpleaños" ? setBirthday : setGraduation;

    const updated = state.services.includes(service)
      ? state.services.filter((s) => s !== service)
      : [...state.services, service];

    setState({
      ...state,
      services: updated,
      total: calculateTotal(updated),
    });
  };

  const handleCreate = async (type, data) => {
    if (!data.date || !data.organizer || !data.hall) {
      alert("Completa fecha, organizador y salón");
      return;
    }

    setLoading(true);

    try {
       const formattedDate = data.date.includes("/")
  ? data.date.split("/").reverse().join("-")
  : data.date;

await axios.post(`${API_URL}/api/events`, {
  type,
  date: formattedDate,
  organizer: data.organizer,
  hall: data.hall,
  extras: data.extras,
  services: data.services,
  total: data.total,
  status: "Pendiente",
});


      Alert.alert("Éxito", "Evento creado correctamente ✅");
      navigation.navigate("Events");
    } catch (error) {
      alert("Error al crear evento");
    } finally {
      setLoading(false);
    }
  };

  const renderBlock = (type, title, icon, state, setState, showPicker, setShowPicker) => (
    <Card style={styles.card}>
      <Card.Title title={`${icon} ${title}`} />
      <Card.Content>
        <Text style={styles.offersTitle}>Servicios:</Text>

        {offers[type].map((service, i) => (
          <View key={i} style={styles.serviceRow}>
            <Checkbox
              status={state.services.includes(service) ? "checked" : "unchecked"}
              onPress={() => toggleService(type, service)}
            />
            <Text>
              {service} (${servicesPrices[service]})
            </Text>
          </View>
        ))}

        <Text style={styles.label}>Fecha:</Text>

{Platform.OS === "web" ? (
  <input
    type="date"
    value={state.date}
    onChange={(e) =>
      setState({ ...state, date: e.target.value })
    }
    style={{
      padding: 10,
      fontSize: 16,
      marginBottom: 10,
    }}
  />
) : (
  <>
    <Button mode="outlined" onPress={() => setShowPicker(true)}>
      {state.date || "Seleccionar fecha"}
    </Button>

    {showPicker && (
      <DateTimePicker
        value={state.date ? new Date(state.date) : new Date()}
        mode="date"
        minimumDate={new Date()}
        onChange={(e, d) => {
          setShowPicker(false);
          if (d) {
            setState({
              ...state,
              date: d.toISOString().split("T")[0],
            });
          }
        }}
      />
    )}
  </>
)}

        <Text style={styles.label}>Organizador:</Text>
        <Picker
          selectedValue={state.organizer}
          onValueChange={(v) => setState({ ...state, organizer: v })}
        >
          <Picker.Item label="Seleccionar" value="" />
          {organizers.map((o, i) => (
            <Picker.Item key={i} label={o} value={o} />
          ))}
        </Picker>

        <Text style={styles.label}>Salón:</Text>
        <Picker
          selectedValue={state.hall}
          onValueChange={(v) => setState({ ...state, hall: v })}
        >
          <Picker.Item label="Seleccionar" value="" />
          {halls.map((h, i) => (
            <Picker.Item key={i} label={h} value={h} />
          ))}
        </Picker>

        <TextInput
          label="Extras"
          value={state.extras}
          onChangeText={(v) => setState({ ...state, extras: v })}
          mode="outlined"
          multiline
        />

        <Text style={styles.total}>Total: ${state.total}</Text>

        <Button
          mode="contained"
          loading={loading}
          disabled={loading}
          onPress={() => handleCreate(type, state)}
        >
          Crear {title}
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✨ Crear Evento ✨</Text>

      {renderBlock(
        "cumpleaños",
        "Cumpleaños",
        "🎂",
        birthday,
        setBirthday,
        showBirthdayPicker,
        setShowBirthdayPicker
      )}

      {renderBlock(
        "graduacion",
        "Graduación",
        "🎓",
        graduation,
        setGraduation,
        showGraduationPicker,
        setShowGraduationPicker
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1976d2",
  },
  card: { marginBottom: 20 },
  offersTitle: { fontWeight: "bold", marginBottom: 8 },
  serviceRow: { flexDirection: "row", alignItems: "center" },
  label: { marginTop: 10, fontWeight: "bold" },
  total: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
