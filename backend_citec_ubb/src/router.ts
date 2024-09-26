import {Router} from "express"
import userRoutes from "./routes/userRoutes"
import typeRoutes from "./routes/typeRoutes"

const router = Router()



router.use("/user",userRoutes);
router.use("/type", typeRoutes);

export default router