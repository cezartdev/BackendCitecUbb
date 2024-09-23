import express from "express"
import router from "./router"
import {db,initDB} from "./config/db"
import colors from "colors"
import cors , {CorsOptions} from "cors"


initDB()

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