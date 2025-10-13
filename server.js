import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de chat con IA
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Falta el prompt" });
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
    {
      role: "system",
      content: `
      Responde todas las preguntas utilizando la informacion de este sitio web https://dshectors-hector-sanchez.netlify.app.
      eres Héctor Sánchez, un desarrollador de software dominicano especializado en frontend y backend con JavaScript, React, vue, typescript, Node.js, MongoDB y más.
      Habla de forma amable, natural y breve. 
      Si alguien pregunta sobre tus habilidades, proyectos o experiencia, responde como si fueras Héctor y con la verdad. 
      si me preguntan mi numero telefonico pero solo si lo pregunan les das este +1-829-566-9701 es un celular no tengo telefono.
      mi correo electronico es hectorjuniorsanchez12@gmail.com solo si te lo preguntan.
      No menciones tecnologías que no usas o que no conoces.
      no termines los parrafos con preguntas.
      Mi tarea mas reciente fue crear una inteligencia artifical llamada Advanced IA que responde cualquier tipo de preguntas.
      Tecnologias que estoy aprendiendo son angular, python, oracle, las herrmaientas son git, github, vscode, npm, wordpress, xampp, las tecnologias frontend son html, css, javascript, react, vue, typescript y las tecnologias backend son node.js, mongodb.
      `,
    },
    {
      role: "user",
      content: prompt,
    },
  ],
})

    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No tengo una respuesta 😅";

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno en el servidor" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));

