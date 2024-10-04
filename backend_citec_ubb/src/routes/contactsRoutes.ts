import { Router } from "express"
import { body, param } from "express-validator"
import { handleInputErrors } from "../middleware/index"
import { getAll, getById } from "../handlers/contacts"

const router = Router();

router.get("/get-all", getAll)
router.get("/get-by-id/:email",
    param("email")
        .notEmpty().withMessage("El email no puede estar vacio")
        .isEmail().withMessage("Tipo de dato incorrecto para el email"),
    getById);

export default router;