import express from "express"
import router from "./router"
import db from "./config/db"
import colors from "colors"
import cors , {CorsOptions} from "cors"
import fs from 'fs';
import path from 'path';

const initDb = async () => {
    const modelsFirstPath = path.join(__dirname, 'models', 'first');  // Ruta a la carpeta 'models/first'
    const modelsPath = path.join(__dirname, 'models');  // Ruta a la carpeta 'models'

    try {
        // Función auxiliar para inicializar tablas de una carpeta específica
        const initializeTablesFromFolder = async (folderPath: string) => {
            // Leer todos los archivos en la carpeta
            const files = fs.readdirSync(folderPath);

            for (const file of files) {
                // Verificar que el archivo es un archivo TypeScript o JavaScript
                if (file.endsWith('.ts') || file.endsWith('.js')) {
                    // Importar el archivo dinámicamente usando require()
                    const model = require(path.join(folderPath, file));

                    // Verificar si el archivo importado tiene el método 'initTable'
                    if (model.default && typeof model.default.initTable === 'function') {
                        await model.default.initTable();  // Llamar al método initTable
                        console.log(`Tabla inicializada desde: ${file}`);
                    }
                }
            }
        };

        // Inicializar las tablas desde 'models/first'
        if (fs.existsSync(modelsFirstPath)) {
            await initializeTablesFromFolder(modelsFirstPath);
        }

        // Inicializar las tablas desde 'models'
        if (fs.existsSync(modelsPath)) {
            await initializeTablesFromFolder(modelsPath);
        }

        console.log('Todas las tablas han sido inicializadas correctamente.');
    } catch (err) {
        console.error('Error al inicializar la base de datos:', err);
    }
};

initDb();

const server = express()

const corsOptions : CorsOptions = {
    origin: function(origin,callback){
        console.log(`Query Origin: ${colors.bgYellow.white.bold(origin)}`)
        if(origin === process.env.FRONTEND_URL || origin === undefined){
            callback(null, true)
        }else{
            callback(new Error("Error de CORS"),false)
        }
    }
}

server.use(cors(corsOptions))

server.use(express.json())


server.use("/api", router)


export default server