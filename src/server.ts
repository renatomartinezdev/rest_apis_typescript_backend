import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import router from "./router";
import db from "./config/db";

//conectar a base de datos
export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.cyan("Conexión exitosa a la base de datos"));
  } catch (error) {
    console.log(
      colors.bgRed.white.bold("Hubo un error al conectar a la base de datos")
    );
    console.log(error);
  }
}

connectDB();

//INSTANCIA DE EXPRESS
const server = express();

//PERMITIR CONEXIONES - CONFIGURACIÓN CORS ROBUSTA
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log("🔍 Origin recibido:", origin);
    console.log("🌐 FRONTEND_URL configurada:", process.env.FRONTEND_URL);

    // Permitir requests sin origin (herramientas de desarrollo, Postman, etc.)
    if (!origin) {
      console.log("✅ Permitiendo request sin origin");
      return callback(null, true);
    }

    // Lista de orígenes permitidos
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:5173", // Para Vite en desarrollo
      "http://localhost:4000", // Puerto alternativo
      "https://rest-apis-typescript-frontend-cmd1.vercel.app", // URL específica de Vercel
    ].filter(Boolean); // Filtrar valores undefined/null

    console.log("🔐 Orígenes permitidos:", allowedOrigins);

    if (allowedOrigins.includes(origin)) {
      console.log("✅ Origin permitido:", origin);
      callback(null, true);
    } else {
      console.log("❌ Origin bloqueado:", origin);
      callback(new Error("Error de CORS - Origin no permitido"));
    }
  },
  credentials: true, // Permitir cookies/auth si es necesario
  optionsSuccessStatus: 200, // Para navegadores legacy
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

server.use(cors(corsOptions));

//LEER DATOS DEL FORMULARIO
server.use(express.json());

//LOGGING
server.use(morgan("combined"));

//RUTAS
server.use("/api/products", router);

//RUTA DE SALUD DEL SERVIDOR
server.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    frontend_url: process.env.FRONTEND_URL,
  });
});

//DOCS
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//MANEJO DE ERRORES 404
server.use("*", (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

export default server;
