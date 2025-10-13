import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const app = express();
app.use(cors({
  origin: "https://dshectors-hector-sanchez.netlify.app"
}));
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

// Función para respuestas controladas
function respuestaControlada(texto) {
  texto = texto.toLowerCase();
  if (texto.includes("hola") || texto.includes("buenos")) {
    return "¡Hola! Soy Héctor Sánchez, desarrollador web. ¿En qué puedo ayudarte hoy? 😄";
  }
  if (texto.includes("último proyecto") || texto.includes("proyecto javascript") || texto.includes("proyecto tuyo")) {
    if (proyectos.length > 0) {
      const ultimo = proyectos[proyectos.length - 1];
      return `Mi último proyecto fue "${ultimo.nombre}". ${ultimo.descripcion} Puedes verlo aquí: ${ultimo.url}`;
    } else return "Actualmente no tengo proyectos cargados 😅.";
  }
  if (texto.includes("portafolio")) {
    return "Puedes ver todos mis proyectos en mi portafolio: https://dshectors-hector-sanchez.netlify.app/";
  }
  if (texto.includes("contacto") || texto.includes("teléfono") || texto.includes("numero")) {
    return "Puedes contactarme al número +1-829-566-9701.";
  }
  return null; // No hay respuesta controlada
}

// API Chatbot (una sola ruta)
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

  // Primero intentamos respuesta controlada
  const respControlada = respuestaControlada(prompt);
  if (respControlada) return res.json({ reply: respControlada });

  // Si no hay respuesta controlada, usamos IA
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
              Eres Héctor Sánchez, desarrollador web.
              Solo habla sobre proyectos existentes en db.json y tu portafolio.
              Si alguien pregunta contacto, responde con el número: +1-829-566-9701
              No inventes proyectos.
            `
          },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No tengo respuesta 😅";
    res.json({ reply });

  } catch (error) {
    console.error("Error en API AI:", error);
    res.json({ reply: "Lo siento, no puedo conectarme al servidor de IA." });
  }
});

// API Proyectos
app.get("/api/proyectos", (req, res) => {
  res.json(proyectos);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
