import { Router } from "express"
import userRoutes from "./routes/userRoutes"
import bussinessLineRoutes from "./routes/bussinessLineRoutes"

const router = Router()

router.use("/user", userRoutes);
router.use("/bussiness-line", bussinessLineRoutes)


export default router;