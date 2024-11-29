import { Router } from "express"
import userRoutes from "./routes/userRoutes"
import bussinessLineRoutes from "./routes/businessLineRoutes"
import typeRoutes from "./routes/typeRoutes"
import regionRoutes from "./routes/regionRoutes"
import provinceRoutes from "./routes/provinceRoutes"
import communeRoutes from "./routes/communeRoutes"
import businessRoutes from "./routes/businessRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import contactsRoutes from "./routes/contactsRoutes"
import workOrderRoutes from "./routes/workOrderRoutes"

const router = Router();


router.use("/user", userRoutes);
router.use("/bussiness-line", bussinessLineRoutes);
router.use("/type", typeRoutes);
router.use("/region", regionRoutes);
router.use("/province", provinceRoutes);
router.use("/commune", communeRoutes);
router.use("/business", businessRoutes);
router.use("/category", categoryRoutes);
router.use("/contacts", contactsRoutes);
router.use("/work-order",workOrderRoutes)

export default router;

