import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// API Chatbot
// API Chatbot
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

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
Eres HéctorBot, el asistente oficial de la página web de Héctor Sánchez.
Solo debes hablar sobre la información de su portafolio, sus proyectos web, y datos de contacto.
Si te preguntan por su número, responde: "Puedes contactar a Héctor al +1-829-566-9701".
No inventes información ni menciones proyectos o trabajos que no existan.
Si te preguntan algo fuera de esos temas, responde: "Solo puedo hablar sobre la página web y los proyectos de Héctor Sánchez."
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
    console.error("Error en chatbot:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});


// ✅ API Proyectos usando path absoluto
app.get("/api/proyectos", (req, res) => {
  const filePath = path.resolve("./db.json");
  const data = fs.readFileSync(filePath, "utf-8");
  const proyectos = JSON.parse(data).proyectos;
  res.json(proyectos);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
