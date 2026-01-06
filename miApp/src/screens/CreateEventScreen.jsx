import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  ImageBackground,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Card,
  Chip,
  Avatar,
  Divider,
  IconButton,
} from "react-native-paper";
import axios from "axios";
import { API_URL } from "../config";

export default function CreateEventScreen({ navigation }) {
  const defaultEvent = {
    title: "",
    date: "",
    time: "",
    organizer: "",
    hall: "",
    address: "",
    capacity: "",
    pricePerPerson: "",
    extras: "",
    services: [],
    theme: "",
    imageUrl: "",
    description: "",
  };

  const [birthday, setBirthday] = useState({ ...defaultEvent });
  const [graduation, setGraduation] = useState({ ...defaultEvent });

n  // Animaciones y micro-interacciones
  const createAnimBirthday = useRef(new Animated.Value(1)).current;
  const createAnimGraduation = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

n  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

n  const pressAndRun = (anim, fn) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.96, duration: 100, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => fn && fn());
  };

n  const birthdayServices = [
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

  const themes = [
    { key: "classic", label: "Clásico", color: "#ff7043" },
    { key: "elegant", label: "Elegante", color: "#7b1fa2" },
    { key: "fun", label: "Divertido", color: "#1976d2" },
    { key: "nature", label: "Natural", color: "#388e3c" },
  ];

  const formatCurrency = (n) => `$${Number(n || 0).toFixed(2)}`;

  const calculateTotal = (services, selected, capacity = 0, pricePerPerson = 0) => {
    const servicesTotal = selected.reduce((sum, s) => {
      const item = services.find((i) => i.name === s);
      return sum + (item?.price || 0);
    }, 0);
    const pax = Number(capacity) || 0;
    const per = Number(pricePerPerson) || 0;
    return servicesTotal + pax * per;
  };

  const toggleService = (setState, serviceName) => {
    setState((prev) => {
      const already = prev.services.includes(serviceName);
      return {
        ...prev,
        services: already
          ? prev.services.filter((s) => s !== serviceName)
          : [...prev.services, serviceName],
      };
    });
  };

  const validate = (data) => {
    if (!data.title || !data.date || !data.time || !data.organizer) {
      return "Completa título, fecha, hora y organizador";
    }
    return null;
  };

  const handleCreate = async (type, data, services) => {
    const err = validate(data);
    if (err) return alert(err);

    try {
      const total = calculateTotal(services, data.services, data.capacity, data.pricePerPerson);
      await axios.post(`${API_URL}/api/events`, {
        title: data.title,
        type,
        description: data.description,
        date: data.date,
        time: data.time,
        organizer: data.organizer,
        hall: data.hall,
        address: data.address,
        capacity: data.capacity,
        pricePerPerson: data.pricePerPerson,
        extras: data.extras,
        services: data.services,
        theme: data.theme,
        imageUrl: data.imageUrl,
        total,
      });

      alert("Evento creado ✅");
      navigation?.navigate?.("Events");
    } catch (err) {
      console.error(err);
      alert("No se pudo crear el evento");
    }
  };

  const ServiceChips = ({ items, state, setState }) => (
    <View style={styles.chipsRow}>
      {items.map((it) => {
        const selected = state.services.includes(it.name);
        return (
          <Chip
            key={it.name}
            mode="outlined"
            selected={selected}
            onPress={() => toggleService(setState, it.name)}
            style={[styles.chip, selected && { borderColor: "#1976d2" }]}
            icon={selected ? "check" : "plus"}
          >
            {it.name} ({formatCurrency(it.price)})
          </Chip>
        );
      })}
    </View>
  );

  const ThemeSelector = ({ state, setState }) => (
    <View style={styles.chipsRow}>
      {themes.map((t) => (
        <Chip
          key={t.key}
          selected={state.theme === t.key}
          onPress={() => setState((p) => ({ ...p, theme: t.key }))}
          style={[styles.themeChip, { borderColor: t.color }]}
          icon={() => <Avatar.Text size={24} label={t.label[0]} />}
        >
          {t.label}
        </Chip>
      ))}
    </View>
  );

  const RenderPreview = ({ type, state, services }) => {
    const themeColor = state.theme ? (themes.find(t => t.key === state.theme)?.color) : null;
    return (
      <Card style={[styles.previewCard, themeColor ? { borderWidth: 2, borderColor: themeColor } : null]}>
        <View style={styles.previewHeader}>
          <Avatar.Icon size={48} icon={type === "cumpleaños" ? "cake" : "school"} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.previewTitle}>{state.title || (type === "cumpleaños" ? "Cumpleaños" : "Graduación")}</Text>
            <Text style={styles.previewSub}>{state.date} • {state.time} • {state.hall}</Text>
          </View>
          <Text style={[styles.previewTotal, themeColor ? { color: themeColor } : null]}>{formatCurrency(calculateTotal(services, state.services, state.capacity, state.pricePerPerson))}</Text>
        </View>
        {state.imageUrl ? (
          <Image source={{ uri: state.imageUrl }} style={styles.previewImage} />
        ) : (
          <Divider />
        )}
        <Card.Content>
          <Text numberOfLines={3} style={{ marginBottom: 8 }}>{state.description || state.extras || "Sin descripción"}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ color: "#666" }}>{state.capacity ? `${state.capacity} pax` : "Capacidad no definida"}</Text>
            <Text style={{ color: "#666" }}>{state.theme ? `Tema: ${themes.find(t => t.key === state.theme)?.label}` : "Tema: -"}</Text>
          </View>
        </Card.Content>
      </Card>
    );
  }; 

  return (
    <ScrollView style={styles.container}>
      <ImageBackground source={{ uri: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=60' }} style={styles.hero}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Crea momentos inolvidables</Text>
          <TouchableOpacity style={styles.heroButton} onPress={() => alert('Inspírate: prueba temas y servicios!')}>
            <Text style={styles.heroButtonText}>Inspírate ✨</Text>
          </TouchableOpacity>
        </View>
        <Animated.Text style={[styles.emoji, { transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0,1], outputRange: ['0deg','360deg'] }) }] }]}>🎉</Animated.Text>
      </ImageBackground>

n      <Text style={styles.title}>✨ Crear Evento (más detallado) ✨</Text> 

      {/* Cumpleaños */}
      <Card style={styles.card}>
        <Card.Title title="🎂 Fiesta de Cumpleaños" subtitle="Crea una celebración inolvidable" />
        <Card.Content>
          <TextInput label="Título" value={birthday.title} onChangeText={(v) => setBirthday((p) => ({ ...p, title: v }))} mode="outlined" style={styles.input} />
          <View style={styles.row}>
            <TextInput label="Fecha" value={birthday.date} onChangeText={(v) => setBirthday((p) => ({ ...p, date: v }))} mode="outlined" style={[styles.input, { flex: 1, marginRight: 8 }]} />
            <TextInput label="Hora" value={birthday.time} onChangeText={(v) => setBirthday((p) => ({ ...p, time: v }))} mode="outlined" style={[styles.input, { flex: 1 }]} />
          </View>
          <TextInput label="Organizador" value={birthday.organizer} onChangeText={(v) => setBirthday((p) => ({ ...p, organizer: v }))} mode="outlined" style={styles.input} />
          <TextInput label="Salón" value={birthday.hall} onChangeText={(v) => setBirthday((p) => ({ ...p, hall: v }))} mode="outlined" style={styles.input} />
          <TextInput label="Dirección" value={birthday.address} onChangeText={(v) => setBirthday((p) => ({ ...p, address: v }))} mode="outlined" style={styles.input} />
          <View style={styles.row}>
            <TextInput label="Capacidad" value={String(birthday.capacity)} onChangeText={(v) => setBirthday((p) => ({ ...p, capacity: v }))} mode="outlined" style={[styles.input, { flex: 1, marginRight: 8 }]} keyboardType="numeric" />
            <TextInput label="Precio por persona" value={String(birthday.pricePerPerson)} onChangeText={(v) => setBirthday((p) => ({ ...p, pricePerPerson: v }))} mode="outlined" style={[styles.input, { flex: 1 }]} keyboardType="numeric" />
          </View>
          <Text style={styles.sectionTitle}>Servicios</Text>
          <ServiceChips items={birthdayServices} state={birthday} setState={setBirthday} />

          <Text style={styles.sectionTitle}>Tema</Text>
          <ThemeSelector state={birthday} setState={setBirthday} />

          <TextInput label="Imagen (URL)" value={birthday.imageUrl} onChangeText={(v) => setBirthday((p) => ({ ...p, imageUrl: v }))} mode="outlined" style={styles.input} />
          <TextInput label="Descripción" value={birthday.description} onChangeText={(v) => setBirthday((p) => ({ ...p, description: v }))} mode="outlined" multiline style={styles.input} />

          <RenderPreview type="cumpleaños" state={birthday} services={birthdayServices} />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
            <Button mode="outlined" onPress={() => setBirthday({ ...defaultEvent })}>Restablecer</Button>
            <Animated.View style={{ transform: [{ scale: createAnimBirthday }] }}>
              <Button mode="contained" icon="cake" onPress={() => pressAndRun(createAnimBirthday, () => handleCreate("cumpleaños", birthday, birthdayServices))} style={styles.createButton}>Crear Cumpleaños</Button>
            </Animated.View>
          </View> 
        </Card.Content>
      </Card>

      {/* Graduación */}
      <Card style={styles.card}>
        <Card.Title title="🎓 Graduación" subtitle="Celebra un gran logro con estilo" />
        <Card.Content>
          <TextInput label="Título" value={graduation.title} onChangeText={(v) => setGraduation((p) => ({ ...p, title: v }))} mode="outlined" style={styles.input} />
          <View style={styles.row}>
            <TextInput label="Fecha" value={graduation.date} onChangeText={(v) => setGraduation((p) => ({ ...p, date: v }))} mode="outlined" style={[styles.input, { flex: 1, marginRight: 8 }]} />
            <TextInput label="Hora" value={graduation.time} onChangeText={(v) => setGraduation((p) => ({ ...p, time: v }))} mode="outlined" style={[styles.input, { flex: 1 }]} />
          </View>
          <TextInput label="Organizador" value={graduation.organizer} onChangeText={(v) => setGraduation((p) => ({ ...p, organizer: v }))} mode="outlined" style={styles.input} />
          <TextInput label="Salón" value={graduation.hall} onChangeText={(v) => setGraduation((p) => ({ ...p, hall: v }))} mode="outlined" style={styles.input} />
          <TextInput label="Dirección" value={graduation.address} onChangeText={(v) => setGraduation((p) => ({ ...p, address: v }))} mode="outlined" style={styles.input} />
          <View style={styles.row}>
            <TextInput label="Capacidad" value={String(graduation.capacity)} onChangeText={(v) => setGraduation((p) => ({ ...p, capacity: v }))} mode="outlined" style={[styles.input, { flex: 1, marginRight: 8 }]} keyboardType="numeric" />
            <TextInput label="Precio por persona" value={String(graduation.pricePerPerson)} onChangeText={(v) => setGraduation((p) => ({ ...p, pricePerPerson: v }))} mode="outlined" style={[styles.input, { flex: 1 }]} keyboardType="numeric" />
          </View>
          <Text style={styles.sectionTitle}>Servicios</Text>
          <ServiceChips items={graduationServices} state={graduation} setState={setGraduation} />

          <Text style={styles.sectionTitle}>Tema</Text>
          <ThemeSelector state={graduation} setState={setGraduation} />

          <TextInput label="Imagen (URL)" value={graduation.imageUrl} onChangeText={(v) => setGraduation((p) => ({ ...p, imageUrl: v }))} mode="outlined" style={styles.input} />
          <TextInput label="Descripción" value={graduation.description} onChangeText={(v) => setGraduation((p) => ({ ...p, description: v }))} mode="outlined" multiline style={styles.input} />

          <RenderPreview type="graduacion" state={graduation} services={graduationServices} />

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
            <Button mode="outlined" onPress={() => setGraduation({ ...defaultEvent })}>Restablecer</Button>
            <Animated.View style={{ transform: [{ scale: createAnimGraduation }] }}>
              <Button mode="contained" icon="school" onPress={() => pressAndRun(createAnimGraduation, () => handleCreate("graduacion", graduation, graduationServices))} style={styles.createButton}>Crear Graduación</Button>
            </Animated.View>
          </View> 
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfbff", padding: 16 },
  hero: { height: 140, borderRadius: 12, overflow: "hidden", marginBottom: 12 },
  heroOverlay: { backgroundColor: "rgba(0,0,0,0.35)", flex: 1, padding: 14, justifyContent: "center" },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 8 },
  heroButton: { backgroundColor: "#fff", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  heroButtonText: { color: "#3b3f72", fontWeight: "700" },
  emoji: { position: "absolute", right: 12, top: 8, fontSize: 28 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 14, textAlign: "center", color: "#3b3f72" },
  card: { marginBottom: 18, borderRadius: 12, backgroundColor: "#fff", elevation: 3, paddingBottom: 6 },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 8, color: "#222" },
  input: { marginBottom: 12 },
  row: { flexDirection: "row" },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 },
  chip: { marginRight: 8, marginBottom: 8 },
  themeChip: { marginRight: 8, marginBottom: 8, borderWidth: 1 },
  previewCard: { marginTop: 12, borderRadius: 10, overflow: "hidden" },
  previewHeader: { flexDirection: "row", alignItems: "center", padding: 12 },
  previewTitle: { fontSize: 16, fontWeight: "700" },
  previewSub: { color: "#666", fontSize: 12 },
  previewTotal: { fontWeight: "700", color: "#1976d2", fontSize: 14 },
  previewImage: { height: 140, width: "100%", resizeMode: "cover" },
  createButton: { backgroundColor: "#1976d2", paddingHorizontal: 18, paddingVertical: 6, borderRadius: 8, elevation: 2 },
}); 
