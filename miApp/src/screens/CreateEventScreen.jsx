import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Platform } from "react-native";
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
    selectedGuests: [],
    budgetPreset: null,
  });

  const [graduation, setGraduation] = useState({
    date: "",
    organizer: "",
    hall: "",
    guests: 0,
    budget: 0,
    extras: "",
    selectedGuests: [],
    budgetPreset: null,
  });

  const [birthdayServices, setBirthdayServices] = useState([]);
  const [graduationServices, setGraduationServices] = useState([]);

  // ================= DATA =================
  const organizers = {
    cumpleaños: [
      "Laura Mendoza",
      "Pedro Castillo",
      "María Fernanda López",
      "José Ramírez",
      "Camila Torres",
    ],
    graduacion: [
      "Andrés Villalba",
      "Paola Sánchez",
      "Ricardo Morales",
      "Daniela Pérez",
      "Felipe Herrera",
    ],
  };

  const halls = {
    cumpleaños: [
      "Salón Fantasía Infantil",
      "Salón Arcoiris Party",
      "Salón Mundo de Sueños",
      "Salón Fiesta Alegre",
      "Salón Estrella Kids",
    ],
    graduacion: [
      "Salón Atenas",
      "Salón Olimpo",
      "Salón Aurora",
      "Salón Horizonte",
      "Salón Imperial",
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

  // Opciones de invitados de ejemplo
  const guestOptions = {
    cumpleaños: [
      "Ana García",
      "Luis Paredes",
      "María Gómez",
      "Carlos Ruiz",
      "Sofía Jiménez",
    ],
    graduacion: [
      "Pedro Ortega",
      "Lucía Mora",
      "Diego Vargas",
      "Fernanda Cruz",
      "Javier León",
    ],
  };

  const budgetPresets = [200, 500, 1000, 2000];

  // UI state for guest pickers
  const [showBirthdayGuestPicker, setShowBirthdayGuestPicker] = useState(false);
  const [showGraduationGuestPicker, setShowGraduationGuestPicker] = useState(false);

  // UI state for date pickers
  const [showBirthdayDatePicker, setShowBirthdayDatePicker] = useState(false);
  const [showGraduationDatePicker, setShowGraduationDatePicker] = useState(false);
  const [DatePickerComponent, setDatePickerComponent] = useState(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const getModule = (name) => {
      try {
        // use eval to avoid static analysis of require by the bundler on web
        return eval("require('" + name + "')");
      } catch (e) {
        return null;
      }
    };

    const mod = getModule('@react-native-community/datetimepicker');
    setDatePickerComponent(() => (mod && mod.default ? mod.default : null));
  }, []);

  // ================= HELPERS =================
  const formatCurrency = (n) =>
    Number(n || 0).toLocaleString("es-EC", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  const isValidDate = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str);

  const toggleService = (serviceName, list, setList) => {
    setList((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const toggleGuest = (guestName, data, setData) => {
    const prev = data.selectedGuests || [];
    const next = prev.includes(guestName)
      ? prev.filter((g) => g !== guestName)
      : [...prev, guestName];
    setData({ ...data, selectedGuests: next, guests: next.length });
  };

  const calcTotal = (servicesNames, typeKey) =>
    offers[typeKey]
      .filter((item) => servicesNames.includes(item.name))
      .reduce((sum, s) => sum + s.price, 0);

  const birthdayTotal = calcTotal(birthdayServices, "cumpleaños");
  const graduationTotal = calcTotal(graduationServices, "graduacion");

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

  const AutocompleteSelect = ({ label, value, onChange, suggestions }) => {
    const [open, setOpen] = useState(false);
    return (
      <View style={{ marginBottom: 12 }}>
        <TouchableOpacity
          style={[styles.input, { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}
          onPress={() => setOpen((s) => !s)}
        >
          <Text style={{ color: value ? '#000' : '#999' }}>{value || label}</Text>
          {value ? (
            <TouchableOpacity onPress={() => { onChange(''); setOpen(false); }}>
              <Text style={{ color: '#999' }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>

        {open && (
          <View style={styles.suggestionBox}>
            {suggestions.map((s, i) => (
              <TouchableOpacity key={i} onPress={() => { onChange(s); setOpen(false); }} style={styles.suggestionItem}>
                <Text>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

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
          <Card
            key={i}
            style={styles.serviceCard}
            onPress={() => toggleService(item.name, services, setServices)}
          >
            <Card.Content style={styles.serviceRow}>
              <Checkbox
                status={services.includes(item.name) ? "checked" : "unchecked"}
                onPress={() => toggleService(item.name, services, setServices)}
              />
              {services.includes(item.name) && <View style={styles.selectedDot} />}
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
          placeholder="Ej. 2026-01-20"
        />

        <AutocompleteSelect
          label="👤 Organizador"
          value={data.organizer}
          onChange={(v) => setData({ ...data, organizer: v })}
          suggestions={organizers[typeKey]}
        />

        <AutocompleteSelect
          label="🏛 Salón"
          value={data.hall}
          onChange={(v) => setData({ ...data, hall: v })}
          suggestions={halls[typeKey]}
        />

        {/* Selección detallada de invitados */}
        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
            {data.guests > 0 && (
              <Text style={{ fontSize: 14, color: "#37474f" }}>👥 Invitados seleccionados: {data.guests}</Text>
            )}
          </View>

          {data.selectedGuests && data.selectedGuests.length > 0 && (
            <View style={styles.selectedGuestsRow}>
              {data.selectedGuests.map((g, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.guestChip}
                  onPress={() => toggleGuest(g, data, setData)}
                >
                  <Text style={styles.guestChipText}>{g} ✕</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {((typeKey === "cumpleaños" && showBirthdayGuestPicker) || (typeKey === "graduacion" && showGraduationGuestPicker)) && (
            <View style={styles.guestPicker}>
              {guestOptions[typeKey].map((g, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.guestItem}
                  onPress={() => toggleGuest(g, data, setData)}
                >
                  <Checkbox
                    status={data.selectedGuests.includes(g) ? "checked" : "unchecked"}
                    onPress={() => toggleGuest(g, data, setData)}
                  />
                  <Text style={styles.guestName}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Campo numérico para invitados */}
        <TextInput
          label="👥 Invitados (número)"
          value={String(data.guests || "")}
          onChangeText={(v) => {
            const n = parseInt(v.replace(/[^0-9]/g, ""), 10) || 0;
            setData({ ...data, guests: n, selectedGuests: (data.selectedGuests || []).slice(0, n) });
          }}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          placeholder="Ej. 120"
        />

        {/* Campo numérico para presupuesto */}
        <TextInput
          label="💰 Presupuesto (USD)"
          value={String(data.budget || "")}
          onChangeText={(v) => {
            const n = parseInt(v.replace(/[^0-9]/g, ""), 10) || 0;
            setData({ ...data, budget: n, budgetPreset: null });
          }}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          placeholder="Ej. 1000"
        />

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