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
          { role: "system", content: "Eres Héctor Sánchez..." },
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

// ✅ API Proyectos usando path absoluto
app.get("/api/proyectos", (req, res) => {
  const filePath = path.resolve("./db.json");
  const data = fs.readFileSync(filePath, "utf-8");
  const proyectos = JSON.parse(data).proyectos;
  res.json(proyectos);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
