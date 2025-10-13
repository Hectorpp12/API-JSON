import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// API Chatbot
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

  // Pregunta específica sobre tu número de contacto
  const texto = prompt.toLowerCase();
  if (texto.includes("número") || texto.includes("teléfono") || texto.includes("contacto")) {
    return res.json({ reply: "Mi número de contacto es: +1-829-566-9701" });
  }

  // Pregunta específica sobre tu página web/proyectos
  if (texto.includes("proyecto") || texto.includes("portafolio") || texto.includes("trabajo")) {
    // Opcional: devolver algo estático o información de tu db.json
    const proyectos = JSON.parse(fs.readFileSync("db.json", "utf-8")).proyectos;
    const nombresProyectos = proyectos.map(p => p.nombre).join(", ");
    return res.json({ reply: `He trabajado en los siguientes proyectos: ${nombresProyectos}` });
  }

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
          { role: "system", content: "Eres Héctor Sánchez, un desarrollador web y experto en software. Responde preguntas de manera útil y profesional." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No tengo respuesta 😅";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// API Proyectos
app.get("/api/proyectos", (req, res) => {
  const proyectos = JSON.parse(fs.readFileSync("db.json", "utf-8")).proyectos;
  res.json(proyectos);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
