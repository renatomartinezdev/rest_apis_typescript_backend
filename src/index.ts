import colors from "colors";
import server from "./server";

// CONFIGURAR PUERTO
const port = process.env.PORT || 4000; 

// INICIAR SERVIDOR
server.listen(port, () => {
 console.log(colors.cyan.bold(`REST API en el puerto ${port}`));
});