const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Almacenamiento temporal
const users = [];
const events = [];

// ✅ Lista de salones ficticios
const availableHalls = [
  "Salón Esmeralda",
  "Salón Rubí",
  "Salón Zafiro",
  "Salón Amatista",
  "Salón Perla",
  "Salón Coral",
  "Salón Turquesa",
  "Salón Topacio",
  "Salón Onix",
  "Salón Platino",
];

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando 🚀");
});

// ✅ Registro de usuarios
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Faltan campos" });
  }
  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "El correo ya está registrado" });
  }
  const newUser = { name, email, password };
  users.push(newUser);
  res.json({ message: "Usuario registrado ✅", user: newUser });
});

// ✅ Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }
  res.json({ user });
});

// ✅ Crear evento con validación de salón ocupado
app.post("/api/events", (req, res) => {
  const { date, organizer, presetTitle, offers, extras, hall } = req.body;

  if (!date || !organizer || !hall) {
    return res.status(400).json({ message: "Fecha, organizador y salón son obligatorios" });
  }

  // Verificar si el salón ya está ocupado en esa fecha
  const hallOccupied = events.find((e) => e.date === date && e.hall === hall);
  if (hallOccupied) {
    const otherHalls = availableHalls.filter((h) => h !== hall);
    return res.status(400).json({
      message: `El salón "${hall}" no está disponible en la fecha ${date}.`,
      suggestion: `Otros salones disponibles: ${otherHalls.join(", ")}`,
    });
  }

  const event = {
    date,
    organizer,
    hall,
    presetTitle: presetTitle || "Evento",
    offers: offers || [],
    extras: extras || "",
  };

  events.push(event);
  res.json({ message: "Evento creado ✅", event });
});

// ✅ Listar eventos
app.get("/api/events", (req, res) => {
  res.json(events);
});

// ✅ Eliminar evento por índice
app.delete("/api/events/:index", (req, res) => {
  const index = parseInt(req.params.index);
  if (index < 0 || index >= events.length) {
    return res.status(404).json({ message: "Evento no encontrado" });
  }
  const deleted = events.splice(index, 1);
  res.json({ message: "Evento eliminado ✅", event: deleted[0] });
});

// Servidor activo
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
