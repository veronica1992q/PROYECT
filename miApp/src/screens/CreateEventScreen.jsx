import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
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
    guests: "",
    budget: "",
    extras: "",
  });

  const [graduation, setGraduation] = useState({
    date: "",
    organizer: "",
    hall: "",
    guests: "",
    budget: "",
    extras: "",
  });

  const [birthdayServices, setBirthdayServices] = useState([]);
  const [graduationServices, setGraduationServices] = useState([]);

  // ================= DATA =================
  const offers = {
    cumpleaños: [
      { name: "Decoración temática", price: 150 },
      { name: "Pastel personalizado", price: 80 },
      { name: "Animación infantil", price: 120 },
      { name: "Fotografía profesional", price: 200 },
    ],
    graduacion: [
      { name: "Decoración elegante", price: 180 },
      { name: "Catering completo", price: 350 },
      { name: "DJ y música", price: 220 },
      { name: "Fotografía profesional", price: 250 },
    ],
  };

  // ================= FUNCTIONS =================
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
      alert("Completa fecha, organizador y salón");
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
      alert("Error al crear el evento");
    }
  };

  // ================= UI BLOCK =================
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
        subtitle="Personaliza cada detalle"
        titleStyle={styles.cardTitle}
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
              <Text style={styles.servicePrice}>${item.price}</Text>
            </Card.Content>
          </Card>
        ))}

        <Card style={styles.totalCard}>
          <Text style={styles.totalLabel}>Subtotal servicios</Text>
          <Text style={styles.totalValue}>${subtotal}</Text>

          <Text style={styles.totalLabel}>Total del evento</Text>
          <Text style={styles.totalFinal}>${total}</Text>
        </Card>

        <Divider style={{ marginVertical: 10 }} />

        <TextInput
          label="📅 Fecha (YYYY-MM-DD)"
          value={data.date}
          onChangeText={(v) => setData({ ...data, date: v })}
        />

        <TextInput
          label="👤 Organizador"
          value={data.organizer}
          onChangeText={(v) => setData({ ...data, organizer: v })}
        />

        <TextInput
          label="🏛 Salón"
          value={data.hall}
          onChangeText={(v) => setData({ ...data, hall: v })}
        />

        <TextInput
          label="👥 Invitados"
          keyboardType="numeric"
          value={data.guests}
          onChangeText={(v) => setData({ ...data, guests: v })}
        />

        <TextInput
          label="💰 Presupuesto"
          keyboardType="numeric"
          value={data.budget}
          onChangeText={(v) => setData({ ...data, budget: v })}
        />

        <TextInput
          label="✨ Extras"
          multiline
          value={data.extras}
          onChangeText={(v) => setData({ ...data, extras: v })}
        />

        <Button
          mode="contained"
          style={styles.createButton}
          onPress={() => createEvent(typeLabel)}
        >
          Crear {typeLabel}
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.heroCard}>
        <Card.Content>
          <Text style={styles.heroTitle}>🎉 Crea tu Evento Ideal</Text>
          <Text style={styles.heroSubtitle}>Hazlo único, elegante e inolvidable</Text>
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#e3f2fd",
    textAlign: "center",
    marginTop: 6,
  },
  eventCard: {
    marginBottom: 30,
    borderRadius: 18,
    backgroundColor: "#fff",
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  serviceCard: {
    marginBottom: 6,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  serviceText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1976d2",
  },
  totalCard: {
    marginTop: 15,
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#f1f8e9",
  },
  totalLabel: {
    fontSize: 13,
    color: "#555",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388e3c",
    marginBottom: 8,
  },
  totalFinal: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b5e20",
  },
  createButton: {
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 6,
    backgroundColor: "#1976d2",
  },
});

