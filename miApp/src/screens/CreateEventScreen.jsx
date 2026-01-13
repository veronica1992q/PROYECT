import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { StyleSheet, ScrollView, View } from "react-native";
import { TextInput, Button, Text, Card, Checkbox, Divider } from "react-native-paper";
import apiClient from "../services/apiClient";

// Componente reutilizable para selección automática
const AutocompleteSelect = ({ label, value, onChange, suggestions }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: 12 }}>
      <Button mode="outlined" onPress={() => setOpen(!open)} style={styles.toggleButton}>
        {value ? `${label}: ${value}` : `Seleccionar ${label}`}
      </Button>
      {open && (
        <View style={styles.suggestionBox}>
          {suggestions.map((s, i) => (
            <Button
              key={i}
              mode={value === s ? "contained" : "outlined"}
              onPress={() => {
                onChange(s);
                setOpen(false);
              }}
              style={styles.suggestionItem}
            >
              {s}
            </Button>
          ))}
        </View>
      )}
    </View>
  );
};

export default function CreateEventScreen({ navigation }) {
  const { user } = useAppContext();

  // ================= STATE ÚNICO =================
  const [event, setEvent] = useState({
    type: "cumpleaños", // alterna entre "cumpleaños" y "graduacion"
    date: "",
    organizer: "",
    hall: "",
    guests: 0,
    budget: 0,
    extras: "",
    services: [],
  });

  // ================= DATA =================
  const organizers = {
    cumpleaños: ["Laura Mendoza", "Pedro Castillo", "María López", "José Ramírez", "Camila Torres"],
    graduacion: ["Andrés Villalba", "Paola Sánchez", "Ricardo Morales", "Daniela Pérez", "Felipe Herrera"],
  };

  const halls = {
    cumpleaños: ["Salón Fantasía Infantil", "Salón Arcoiris Party", "Salón Mundo de Sueños", "Salón Fiesta Alegre", "Salón Estrella Kids"],
    graduacion: ["Salón Atenas", "Salón Olimpo", "Salón Aurora", "Salón Horizonte", "Salón Imperial"],
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

  const toggleService = (serviceName) => {
    const prev = event.services || [];
    const next = prev.includes(serviceName)
      ? prev.filter((s) => s !== serviceName)
      : [...prev, serviceName];
    setEvent({ ...event, services: next });
  };

  const calcTotal = (servicesNames, typeKey) =>
    offers[typeKey]
      .filter((item) => servicesNames.includes(item.name))
      .reduce((sum, s) => sum + s.price, 0);

  // ================= CREATE EVENT =================
  const createEvent = async () => {
    const totalServices = calcTotal(event.services, event.type);
    const totalGeneral = totalServices + Number(event.budget || 0);

    if (!event.date || !event.organizer || !event.hall) {
      alert("⚠️ Completa fecha, organizador y salón");
      return;
    }
    if (!isValidDate(event.date)) {
      alert("📅 Usa el formato de fecha YYYY-MM-DD (ej. 2026-01-20)");
      return;
    }

    try {
      await apiClient.post("/api/eventos", {
        type: event.type === "cumpleaños" ? "Cumpleaños" : "Graduación",
        presetTitle: event.type === "cumpleaños" ? "🎂 Cumpleaños" : "🎓 Graduación",
        ...event,
        services: event.services,
        totalServices,
        totalGeneral,
        user_email: user?.email || "",
      });

      alert("🎉 Evento creado con éxito");
      navigation.navigate("Events");
    } catch (error) {
      alert("❌ Error al crear el evento");
    }
  };

  // ================= RENDER =================
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.heroCard}>
        <Card.Content>
          <Text style={styles.heroTitle}>🎉 Crea tu Evento Ideal</Text>
          <Text style={styles.heroSubtitle}>Hazlo único, elegante e inolvidable</Text>
        </Card.Content>
      </Card>

      {/* Selector de tipo de evento */}
      <View style={styles.selectorRow}>
        <Button
          mode={event.type === "cumpleaños" ? "contained" : "outlined"}
          onPress={() => setEvent({ ...event, type: "cumpleaños", organizer: "", hall: "" })}
        >
          🎂 Cumpleaños
        </Button>
        <Button
          mode={event.type === "graduacion" ? "contained" : "outlined"}
          onPress={() => setEvent({ ...event, type: "graduacion", organizer: "", hall: "" })}
        >
          🎓 Graduación
        </Button>
      </View>

      {/* Servicios */}
      {offers[event.type].map((item, i) => (
        <Card key={i} style={styles.serviceCard} onPress={() => toggleService(item.name)}>
          <Card.Content style={styles.serviceRow}>
            <Checkbox
              status={event.services.includes(item.name) ? "checked" : "unchecked"}
              onPress={() => toggleService(item.name)}
            />
            <Text style={styles.serviceText}>{item.name}</Text>
            <Text style={styles.servicePrice}>{formatCurrency(item.price)}</Text>
          </Card.Content>
        </Card>
      ))}

      {/* Totales */}
      <Card style={styles.totalCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal servicios</Text>
          <Text style={styles.totalValue}>{formatCurrency(calcTotal(event.services, event.type))}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total del evento</Text>
          <Text style={styles.totalFinal}>
            {formatCurrency(calcTotal(event.services, event.type) + Number(event.budget || 0))}
          </Text>
        </View>
      </Card>

      <Divider style={{ marginVertical: 12 }} />

      {/* Detalles */}
      <TextInput
        label="📅 Fecha (YYYY-MM-DD)"
        value={event.date}
        onChangeText={(v) => setEvent({ ...event, date: v })}
        style={styles.input}
        mode="outlined"
        placeholder="Ej. 2026-01-20"
      />

      {/* Selector dinámico de organizador */}
      <AutocompleteSelect
        label="Organizador"
        value={event.organizer}
        onChange={(v) => setEvent({ ...event, organizer: v })}
        suggestions={organizers[event.type]}
      />

      {/* Selector dinámico de salón */}
      <AutocompleteSelect
        label="Salón"
        value={event.hall}
        onChange={(v) => setEvent({ ...event, hall: v })}
        suggestions={halls[event.type]}
      />

      <TextInput
        label="👥 Invitados (número)"
        value={String(event.guests || "")}
        onChangeText={(v) => {
          const n = parseInt(v.replace(/[^0-9]/g, ""), 10) || 0;
          setEvent({ ...event, guests: n });
        }}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
        placeholder="Ej. 120"
      />

      <TextInput
        label="💰 Presupuesto (USD)"
        value={String(event.budget || "")}
        onChangeText={(v) => {
          const n = parseInt(v.replace(/[^0-9]/g, ""), 10) || 0;
          setEvent({ ...event, budget: n });
        }}
        style={styles.input}
        mode="outlined"
        keyboardType="numeric"
        placeholder="Ej. 1000"
      />

      <TextInput
        label="✨ Extras"
        multiline
        value={event.extras}
        onChangeText={(v) => setEvent({ ...event, extras: v })}
        style={styles.input}
        mode="outlined"
        placeholder="Notas especiales, requerimientos..."
      />

      <Button mode="contained" style={styles.createButton} onPress={createEvent}>
        🚀 Crear {event.type === "cumpleaños" ? "Cumpleaños" : "Graduación"}
      </Button>
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
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1976d2",
    marginRight: 8,
  },
  guestPicker: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 8,
    backgroundColor: "#fff",
  },
  guestItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  guestName: {
    marginLeft: 8,
    fontSize: 15,
    color: "#263238",
  },
  selectedGuestsRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  guestChip: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 6,
  },
  guestChipText: {
    color: "#1565c0",
    fontWeight: "600",
  },
  presetButton: {
    borderRadius: 8,
  },
  presetButtonSelected: {
    backgroundColor: "#1976d2",
    borderRadius: 8,
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
