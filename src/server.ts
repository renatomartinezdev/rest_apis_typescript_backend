import express from "express"
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger'
import router from "./router"
import db from "./config/db"

//conectar a base de datos
export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.cyan("Coneccion exitosa a la base de datos"));
  } catch (error) {
    console.log(error);
    console.log(colors.bgRed.white.bold("Hubo un error al conectar a la base de datos"))
  }
}

connectDB();


const server = express()


const corsOptions: CorsOptions = {
  origin: function(origin, callback){
    
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://rest-apis-typescript-frontend-cmd1.vercel.app'
    ];
    
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {

      console.log('Origin no reconocido pero permitido:', origin);
      callback(null, true);
    }
  },
  credentials: true
}

server.use(cors(corsOptions))


server.use(express.json())

server.use(morgan('combined'))

server.use("/api/products", router)


server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec) )

export default server