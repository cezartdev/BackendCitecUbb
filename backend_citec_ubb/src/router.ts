import {Router} from "express"
import db from "./config/db"
import userRoutes from "./routes/userRoutes"

const router = Router()

router.use("/user",userRoutes);


export default router