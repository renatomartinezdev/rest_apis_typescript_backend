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
    // console.log(colors.cyan("Coneccion exitosa a la base de datos"));
  } catch (error) {
    // console.log(error);
    console.log(colors.bgRed.white.bold("Hubo un error al conectar a la base de datos"))
  }
}

connectDB();

//INSTANCIA DE EXPRESS
const server = express()

//PERMITIR CONEXIONES
const corsOptions: CorsOptions = {
  origin: function(origin, callback){
   if(origin === process.env.FRONTEND_URL){
    callback(null, true)
   } else{
    callback(new Error('Error de CORS'))
   }

  }
}

server.use(cors(corsOptions))

//LEER DATOS DEL FORMULARIO
server.use(express.json())

server.use(morgan(''))

server.use("/api/products", router)


//DOCS
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec) )


export default server
