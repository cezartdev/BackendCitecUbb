import { Router } from "express"
import userRoutes from "./routes/userRoutes"
import bussinessLineRoutes from "./routes/bussinessLineRoutes"
import typeRoutes from "./routes/typeRoutes"

const router = Router()



router.use("/user", userRoutes);
router.use("/bussiness-line", bussinessLineRoutes)
router.use("/type", typeRoutes);

export default router;