import { Router } from "express"
import { body, param } from "express-validator"
import { handleInputErrors } from "../middleware/index"
import { getAll, getById } from "../handlers/businessLine-business"

const router = Router();

router.get("/get-all", getAll)
router.get("/get-by-id/:rut",
    param("rut")
        .notEmpty().withMessage("El rut no puede estar vacio")
        .isString().withMessage("Tipo de dato incorrecto para el rut"),
    getById);

export default router;