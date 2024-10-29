import { Router } from "express"
import userRoutes from "./routes/userRoutes"
import businessLineRoutes from "./routes/businessLineRoutes"
import typeRoutes from "./routes/typeRoutes"
import regionRoutes from "./routes/regionRoutes"
import provinceRoutes from "./routes/provinceRoutes"
import communeRoutes from "./routes/communeRoutes"
import businessRoutes from "./routes/businessRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import contactsRoutes from "./routes/contactsRoutes"

const router = Router();



router.use("/user", userRoutes);
router.use("/business-line", businessLineRoutes);
router.use("/type", typeRoutes);
router.use("/region", regionRoutes);
router.use("/province", provinceRoutes);
router.use("/commune", communeRoutes);
router.use("/business", businessRoutes);
router.use("/category", categoryRoutes);
router.use("/contacts", contactsRoutes);

export default router;