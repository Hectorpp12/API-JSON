import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Cargar proyectos desde db.json
const proyectosPath = path.resolve("./db.json");
let proyectos = [];
try {
  const data = fs.readFileSync(proyectosPath, "utf-8");
  proyectos = JSON.parse(data).proyectos;
} catch (error) {
  console.error("No se pudo leer db.json:", error);
}

// API Chatbot
app.post("/api/chat", (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

  const texto = prompt.toLowerCase();
  let respuesta = "Prefiero hablar sobre mis proyectos o mi trabajo en desarrollo web 😄.";

  // Respuestas controladas
  if (texto.includes("hola") || texto.includes("buenos")) {
    respuesta = "¡Hola! Soy Héctor Sánchez, desarrollador web. ¿En qué puedo ayudarte hoy? 😄";
  } else if (texto.includes("último proyecto") || texto.includes("proyecto javascript")) {
    const ultimo = proyectos[proyectos.length - 1]; // toma el último proyecto
    respuesta = `Mi último proyecto fue "${ultimo.nombre}". ${ultimo.descripcion} Puedes verlo aquí: ${ultimo.url}`;
} else if (texto.includes("portafolio")) {
    respuesta = `Puedes ver todos mis proyectos en mi portafolio: https://dshectors-hector-sanchez.netlify.app/`;
  } else if (texto.includes("contacto") || texto.includes("teléfono") || texto.includes("numero")) {
    respuesta = "Puedes contactarme al número +1-829-566-9701.";
  } else if (texto.includes("fortalezas")) {
    respuesta = "Mis fortalezas incluyen resolución de problemas, aprendizaje rápido y trabajo en equipo.";
  } else if (texto.includes("debilidades")) {
    respuesta = "Una de mis áreas de mejora es que a veces me concentro demasiado en los detalles, pero estoy trabajando en equilibrar eficiencia y precisión.";
  } else if (texto.includes("último empleo") || texto.includes("trabajo anterior")) {
    respuesta = "Mi último empleo fue como desarrollador de software enfocado en proyectos web.";
  } else if (texto.includes("por qué quieres este trabajo")) {
    respuesta = "Porque me interesa crecer profesionalmente en un entorno desafiante donde pueda aplicar mis conocimientos y aprender de un equipo talentoso.";
  } else if (texto.includes("dónde te ves") || texto.includes("5 años")) {
    respuesta = "Me veo liderando proyectos de desarrollo y aportando soluciones innovadoras dentro de la empresa.";
  }

  res.json({ reply: respuesta });
});

// API Proyectos
app.get("/api/proyectos", (req, res) => {
  res.json(proyectos);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
