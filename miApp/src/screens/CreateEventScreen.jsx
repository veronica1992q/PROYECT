import React, { useState } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import {
  TextInput,
  Button,
  Text,
  Card,
  Checkbox,
  Divider,
} from "react-native-paper";
import axios from "axios";
import { API_URL } from "../config";

export default function CreateEventScreen({ navigation }) {
  // ================= STATES =================
  const [birthday, setBirthday] = useState({
    date: "",
    organizer: "",
    hall: "",
    guests: 0,
    budget: 0,
    extras: "",
  });

  const [graduation, setGraduation] = useState({
    date: "",
    organizer: "",
    hall: "",
    guests: 0,
    budget: 0,
    extras: "",
  });

  const [birthdayServices, setBirthdayServices] = useState([]);
  const [graduationServices, setGraduationServices] = useState([]);

  // ================= DATA =================
  const organizers = {
    cumpleaños: [
      "Valeria Torres",
      "Martín Herrera",
      "Sofía Delgado",
      "Andrés Cevallos",
      "Carla Jiménez",
    ],
    graduacion: [
      "Gabriela Muñoz",
      "Diego Salazar",
      "Natalia Ríos",
      "Juan Esteban Paredes",
      "Alejandra Castillo",
    ],
  };

  const halls = {
    cumpleaños: [
      "Salón Dulce Fantasía",
      "Salón Estrella Mágica",
      "Salón Sonrisas Kids",
      "Salón Fiesta Colorida",
      "Salón Mundo Infantil",
    ],
    graduacion: [
      "Salón Magna",
      "Salón Atenea",
      "Salón Victoria",
      "Salón Horizonte",
      "Salón Premier",
    ],
  };

  const offers = {
    cumpleaños: [
      { name: "🎈 Decoración temática", price: 150 },
      { name: "🍰 Pastel personalizado", price: 80 },
      { name: "🤹 Animación infantil", price: 120 },
      { name: "📸 Fotografía profesional", price: 200 },
    ],
    graduacion: [
      { name: "🌹 Decoración elegante", price: 180 },
      { name: "🍽 Catering completo", price: 350 },
      { name: "🎵 DJ y música", price: 220 },
      { name: "📸 Fotografía profesional", price: 250 },
    ],
  };

  // ================= HELPERS =================
  const formatCurrency = (n) =>
    Number(n || 0).toLocaleString("es-EC", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const isValidDate = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str);

  const toggleService = (service, list, setList) => {
    setList((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const calcTotal = (services) =>
    services.reduce((sum, s) => sum + s.price, 0);

  const birthdayTotal = calcTotal(birthdayServices);
  const graduationTotal = calcTotal(graduationServices);

  const birthdayGeneral = birthdayTotal + Number(birthday.budget || 0);
  const graduationGeneral = graduationTotal + Number(graduation.budget || 0);

  const createEvent = async (type) => {
    const data = type === "Cumpleaños" ? birthday : graduation;
    const services = type === "Cumpleaños" ? birthdayServices : graduationServices;
    const totalServices = type === "Cumpleaños" ? birthdayTotal : graduationTotal;
    const totalGeneral = type === "Cumpleaños" ? birthdayGeneral : graduationGeneral;

    if (!data.date || !data.organizer || !data.hall) {
      alert("⚠️ Completa fecha, organizador y salón");
      return;
    }
    if (!isValidDate(data.date)) {
      alert("📅 Usa el formato de fecha YYYY-MM-DD (ej. 2026-01-20)");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/events`, {
        type,
        presetTitle: type === "Cumpleaños" ? "🎂 Cumpleaños" : "🎓 Graduación",
        ...data,
        services,
        totalServices,
        totalGeneral,
      });

      alert("🎉 Evento creado con éxito");
      navigation.navigate("Events");
    } catch (error) {
      alert("❌ Error al crear el evento");
    }
  };

  // ================= UI HELPERS =================
  const renderStepper = (label, value, setValue, step = 1) => (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={() => setValue(Math.max(0, value - step))}
        >
          <Text style={styles.stepperText}>➖</Text>
        </TouchableOpacity>
        <Text style={styles.stepperValue}>{value}</Text>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={() => setValue(value + step)}
        >
          <Text style={styles.stepperText}>➕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAutocomplete = (label, value, setValue, suggestions) => (
    <View style={{ marginBottom: 12 }}>
      <TextInput
        label={label}
        value={value}
        onChangeText={(v) => setValue(v)}
        style={styles.input}
        mode="outlined"
        placeholder={`Escribe para sugerencias...`}
      />
      {value.length > 0 && (
        <View style={styles.suggestionBox}>
          {suggestions
            .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
            .map((s, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setValue(s)}
                style={styles.suggestionItem}
              >
                <Text>{s}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
    </View>
  );

  const renderEventCard = (
    title,
    typeKey,
    typeLabel,
    data,
    setData,
    services,
    setServices,
    subtotal,
    total
  ) => (
    <Card style={styles.eventCard}>
      <Card.Title
        title={title}
        subtitle="✨ Personaliza cada detalle"
        titleStyle={styles.cardTitle}
        subtitleStyle={styles.cardSubtitle}
      />
      <Card.Content>
        <Text style={styles.sectionTitle}>🎯 Servicios disponibles</Text>

        {offers[typeKey].map((item, i) => (
          <Card key={i} style={styles.serviceCard}>
            <Card.Content style={styles.serviceRow}>
              <Checkbox
                status={services.includes(item) ? "checked" : "unchecked"}
                onPress={() => toggleService(item, services, setServices)}
              />
              <Text style={styles.serviceText}>{item.name}</Text>
              <Text style={styles.servicePrice}>{formatCurrency(item.price)}</Text>
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal servicios</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total del evento</Text>
            <Text style={styles.totalFinal}>{formatCurrency(total)}</Text>
          </View>
        </Card>

        <Divider style={{ marginVertical: 12 }} />

        <Text style={styles.sectionTitle}>🗓 Detalles del evento</Text>

        <TextInput
          label="📅 Fecha (YYYY-MM-DD)"
          value={data.date}
          onChangeText={(v) => setData({ ...data, date: v })}
          style={styles.input}
          mode="outlined"
          placeholder="Ej. 2026-02-14"
        />

        {renderAutocomplete(
          "👤 Organizador",
          data.organizer,
          (v) => setData({ ...data, organizer: v }),
          organizers[typeKey]
        )}

        {renderAutocomplete(
          "🏛 Salón",
          data.hall,
          (v) => setData({ ...data, hall: v }),
          halls[typeKey]
        )}

        {renderStepper(
          "👥 Invitados",
          Number(data.guests),
          (v) => setData({ ...data, guests: v }),
          5
        )}

        {renderStepper(
          "💰 Presupuesto (USD)",
          Number(data.budget),
          (v) => setData({ ...data, budget: v }),
          50
        )}

        <TextInput
          label="✨ Extras"
          multiline
          value={data.extras}
          onChangeText={(v) => setData({ ...data, extras: v })}
          style={styles.input}
          mode="outlined"
          placeholder="Notas especiales, requerimientos..."
        />

        <Button
          mode="contained"
          style={styles.createButton}
          onPress={() => createEvent(typeLabel)}
        >
          🚀 Crear {typeLabel}
        </Button>
      </Card.Content>
    </Card>
  );

  // ================= RENDER =================
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.heroCard}>
        <Card.Content>
          <Text style={styles.heroTitle}>🎉 Crea tu Evento Ideal</Text>
          <Text style={styles.heroSubtitle}>
            Hazlo único, elegante e inolvidable
          </Text>
        </Card.Content>
      </Card>

      {renderEventCard(
        "🎂 Fiesta de Cumpleaños",
        "cumpleaños",
        "Cumpleaños",
        birthday,
        setBirthday,
        birthdayServices,
        setBirthdayServices,
        birthdayTotal,
        birthdayGeneral
      )}

      {renderEventCard(
        "🎓 Evento de Graduación",
        "graduacion",
        "Graduación",
        graduation,
        setGraduation,
        graduationServices,
        setGraduationServices,
        graduationTotal,
        graduationGeneral
      )}
    </ScrollView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f4f6f8",
  },
  heroCard: {
    backgroundColor: "#1976d2",
    borderRadius: 20,
    marginBottom: 25,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#e3f2fd",
    textAlign: "center",
    marginTop: 6,
  },
  eventCard: {
    marginBottom: 30,
    borderRadius: 18,
    backgroundColor: "#fff",
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e8eaf6",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  cardSubtitle: {
    color: "#546e7a",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#37474f",
  },
  serviceCard: {
    marginBottom: 8,
    backgroundColor: "#fafafa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  serviceText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#263238",
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
  },
  totalCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#f1f8e9",
    borderWidth: 1,
    borderColor: "#C8E6C9",
    gap: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  totalLabel: {
    fontSize: 14,
    color: "#607d8b",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388e3c",
  },
  totalFinal: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b5e20",
  },
  input: {
    marginTop: 8,
    backgroundColor: "#fff",
  },
  suggestionBox: {
    marginTop: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  stepperRow: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fafafa",
  },
  stepperLabel: {
    fontSize: 14,
    color: "#37474f",
    marginBottom: 6,
    fontWeight: "600",
  },
  stepperControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepperButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  stepperText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#263238",
  },
  createButton: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 8,
    backgroundColor: "#1976d2",
  },
});
