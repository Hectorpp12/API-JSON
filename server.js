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

  if (texto.includes("hola") || texto.includes("buenos")) {
    respuesta = "¡Hola! Soy Héctor Sánchez, desarrollador web. ¿En qué puedo ayudarte hoy? 😄";
  } else if (texto.includes("último proyecto") || texto.includes("proyecto javascript") || texto.includes("proyecto tuyo")) {
    if (proyectos.length > 0) {
      const ultimo = proyectos[proyectos.length - 1];
      respuesta = `Mi último proyecto fue "${ultimo.nombre}". ${ultimo.descripcion} Puedes verlo aquí: ${ultimo.url}`;
    } else {
      respuesta = "Actualmente no tengo proyectos cargados 😅.";
    }
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


app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Falta el prompt" });

  // Primero buscamos respuesta controlada
  const respControlada = respuestaControlada(prompt);
  if (respControlada) return res.json({ reply: respControlada });

  // Si no hay respuesta controlada, usamos OpenRouter / OpenAI
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
              Siempre responde sobre tus proyectos de db.json.
              Si la pregunta trata de proyectos, responde únicamente con los datos de db.json.
              Si te preguntan cómo contactarte, responde: "Puedes contactarme al número +1-829-566-9701."
              No inventes proyectos ni experiencias que no existan.
              si te preguntan algo que no sepas la respuesta buscala en este sitio web https://dshectors-hector-sanchez.netlify.app/ y si no esta ahi pues respondeles esa informacion es mejor consultarla con hector directamente aqui tiene su nuemro y le das mi numero.
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
