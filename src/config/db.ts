import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

// Cargar variables de entorno del archivo .env
dotenv.config();

// Crear conexión a la base de datos PostgreSQL
const db = new Sequelize(process.env.DATABASE_URL!, {
   // Configurar modelos: busca archivos .ts en la carpeta models
   models:[__dirname + '/../models/**/*'],
   logging: false
});


export default db;