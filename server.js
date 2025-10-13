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
              recuerda que eres hector sanchez no puedes inventarte ningun proyecto si te piden algun proyecto lo buscas en db.json de aqui "proyectos": [
        {
            "id": 1,
            "nombre": "1- APV Con TypeScripts",
            "img": "API/img/Diseño sin título (2).jpg",
            "url": "https://ephemeral-fenglisu-ec4e35.netlify.app",
            "descripcion": "Aplicación web desarrollada para la gestión integral de pacientes en una clínica veterinaria. Implementada con TypeScript, React y Tailwind CSS, ofrece una interfaz moderna, intuitiva y completamente dinámica que facilita el registro, seguimiento y administración de los pacientes de manera eficiente."
        },
        {
            "id": 2,
            "nombre": "2- APV Proyecto FullStack con NodeJS y React",
            "img": "API/img/Captura de pantalla 2025-10-04 213857.png",
            "url": "https://administrador-pacientes-mern-hector.netlify.app",
            "descripcion": "Aplicación Full Stack para la gestión de pacientes en una clínica veterinaria. Desarrollada con NodeJS, Express, MongoDB, React y Tailwind CSS, brinda una experiencia fluida, moderna y eficiente, conectando el backend y el frontend de forma óptima."
        },
        {
            "id": 3,
            "nombre": "3- Cotizador de prestamos con Vue",
            "img": "API/img/Captura de pantalla 2025-10-04 214206.png",
            "url": "https://prestamos-vue-hector-sanchez.netlify.app",
            "descripcion": "Plataforma web que permite a los usuarios calcular y simular préstamos personales a plazos. Creada con Vue.js y Tailwind CSS, ofrece una interfaz limpia, dinámica y fácil de usar, ideal para comparar opciones de financiamiento de manera rápida y precisa."
        },
        {
            "id": 4,
            "nombre": "4- Cotizador de prestamos con React",
            "img": "API/img/Captura de pantalla 2025-10-04 214206.png",
            "url": "https://cotizadorprestamos-react-hector.netlify.app",
            "descripcion": "Cotizador de préstamos personales desarrollado con React y Tailwind CSS. Permite calcular montos, intereses y plazos de manera dinámica y visual, ofreciendo una experiencia moderna, fluida y fácil de usar."
        },
        {
            "id": 5,
            "nombre": "5- Cursos En Línea con JS",
            "img": "API/img/Diseño sin título (5).png",
            "url": "https://lucent-gnome-062f33.netlify.app",
            "descripcion": "Plataforma de cursos en línea que permite explorar, inscribirse y completar cursos en distintas áreas. Construida con JavaScript, ofrece una experiencia interactiva, atractiva y accesible desde cualquier dispositivo."
        },
        {
            "id": 6,
            "nombre": "6- Gastos Semanales",
            "img": "API/img/Diseño sin título (7).png",
            "url": "https://cool-rabanadas-bbda15.netlify.app",
            "descripcion": "Aplicación web para el control y gestión de gastos semanales, desarrollada con JavaScript y Bootstrap. Proporciona una interfaz profesional, dinámica y fácil de usar para organizar las finanzas personales."
        },
        {
            "id": 7,
            "nombre": "7- Buscador de Autos",
            "img": "API/img/Diseño sin título (4).png",
            "url": "https://jovial-douhua-b750c0.netlify.app",
            "descripcion": "Página web que permite buscar y filtrar automóviles según criterios como marca, modelo, año y precio. Desarrollada con JavaScript, ofrece una navegación rápida, dinámica y eficiente para los usuarios."
        },
                {
            "id": 8,
            "nombre": "8- Envio de Emails",
            "img": "API/img/Diseño sin título (3).png",
            "url": "https://magenta-axolotl-2ddf37.netlify.app",
            "descripcion": "Aplicación web que facilita el envío de correos electrónicos de forma rápida y sencilla. Construida con JavaScript, ofrece una experiencia fluida, intuitiva y moderna."
        },
        {
            "id": 9,
            "nombre": "9- Tweets",
            "img": "API/img/Diseño sin título (6).png",
            "url": "https://fanciful-blancmange-509f98.netlify.app",
            "descripcion": "Plataforma de microblogging inspirada en Twitter, que permite publicar y compartir mensajes cortos. Desarrollada utilizando JSON para la gestión de datos, brinda una experiencia interactiva y dinámica."
        },        
        {
            "id": 10,
            "nombre": "10- Restaurant App con JSON",
            "img": "API/img/Captura de pantalla 2025-10-05 171800.png",
            "url": "https://flourishing-fox-09aa57.netlify.app",
            "descripcion": "Aplicación web para un restaurante, que permite explorar el menú, realizar pedidos y gestionar reservas. Implementada con JSON para el manejo de datos, ofrece una experiencia eficiente, moderna y fácil de navegar"
        },
        {
            "id": 11,
            "nombre": "11- Advanced IA",
            "img": "API/img/Captura de pantalla 2025-10-11 065330.png",
            "url": "https://whimsical-kashata-d5669d.netlify.app",
            "descripcion": "Proyecto avanzado de Inteligencia Artificial, diseñado para ofrecer soluciones innovadoras integrando tecnologías como JavaScript, NodeJS, y OpenAI, con un enfoque en eficiencia y automatización."
        }
    ]
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
