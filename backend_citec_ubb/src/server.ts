import express from "express"
import router from "./router"
import colors from "colors"
import swaggerUi from "swagger-ui-express"
import swaggerSpec from "./config/swagger"
import cors , {CorsOptions} from "cors"
import fs from 'fs';
import path from 'path';
import {validateApiKey} from './middleware/index'

const initDb = async () => {
    const modelsPath = path.join(__dirname, 'models');
    const models = [];

    // Leer todos los archivos de modelos
    const files = fs.readdirSync(modelsPath);
    for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
            const model = require(path.join(modelsPath, file));
            if (model.default && typeof model.default.initTable === 'function') {
                models.push(model.default);  // Agregar el modelo a la lista
            }
        }
    }

    // Función para ordenar modelos según dependencias
    const orderModelsByDependencies = (models) => {
        const ordered = [];
        const seen = new Set();
        const visiting = new Set();  // Para detectar ciclos

        const visit = (model) => {
            if (seen.has(model)) return;
            if (visiting.has(model)) {
                throw new Error(`Ciclo detectado en las dependencias de la tabla ${model.nombreTabla}`);
            }

            visiting.add(model);

            // Asegurarse de que las dependencias se inicialicen primero
            for (const dependency of model.dependencies || []) {
                const dependencyModel = models.find(m => m.nombreTabla === dependency);
                if (dependencyModel) {
                    visit(dependencyModel);
                } else {
                    console.warn(`Dependencia ${dependency} no encontrada para la tabla ${model.nombreTabla}`);
                }
            }

            visiting.delete(model);
            seen.add(model);
            ordered.push(model);
        };

        for (const model of models) {
            visit(model);
        }

        return ordered;
    };

    try {
        // Ordenar modelos según dependencias
        const orderedModels = orderModelsByDependencies(models);

        // Inicializar las tablas en orden
        for (const model of orderedModels) {
            await model.initTable();
            console.log(`Tabla inicializada: ${model.nombreTabla}`);
        }

        console.log('Todas las tablas han sido inicializadas correctamente.');
    } catch (err) {
        console.error('Error al inicializar la base de datos:', err);
    }
};

if(process.env.NODE_ENV !== 'test'){
    initDb();
}


const server = express()

const corsOptions : CorsOptions = {
    origin: function(origin,callback){
        console.log(`Query Origin: ${colors.bgYellow.white.bold(origin)}`)
        if(origin === process.env.FRONTEND_URL){
            callback(null, true)
        }else{
            callback(new Error("Error de CORS"),false)
        }
    }
}

server.use(cors(corsOptions))

server.use(express.json())

// Rutas protegidas con API_KEY
server.use('/api/:key', validateApiKey, router);

// Documentación protegida con API_KEY
server.use('/docs/:key', validateApiKey, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default server