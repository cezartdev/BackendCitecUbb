import { Router } from "express"
import userRoutes from "./routes/userRoutes"
import bussinessLineRoutes from "./routes/bussinessLineRoutes"
import typeRoutes from "./routes/typeRoutes"
import categoryRoutes from "./routes/categoryRoutes"

const router = Router()



router.use("/user", userRoutes);
router.use("/bussiness-line", bussinessLineRoutes)
router.use("/type", typeRoutes);
router.use("category", categoryRoutes);

export default router;