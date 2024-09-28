import { Router } from "express"
import userRoutes from "./routes/userRoutes"
import bussinessLineRoutes from "./routes/bussinessLineRoutes"
import typeRoutes from "./routes/typeRoutes"
import regionRoutes from "./routes/regionRoutes"
import provinceRoutes from "./routes/provinceRoutes"
import communeRoutes from "./routes/communeRoutes"

const router = Router();



router.use("/user", userRoutes);
router.use("/bussiness-line", bussinessLineRoutes);
router.use("/type", typeRoutes);
router.use("/region",regionRoutes);
router.use("/province", provinceRoutes);
router.use("/commune",communeRoutes);

export default router;