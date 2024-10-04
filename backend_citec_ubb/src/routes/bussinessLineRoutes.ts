import { Router } from "express"
import { body, param } from "express-validator"
import { handleInputErrors } from "../middleware/index"
import { getAll, getById } from "../handlers/bussinessLine"


const router = Router();

router.get("/get-all", getAll)
router.get("/get-by-id/:codigo",
    param("codigo")
        .notEmpty().withMessage("El codigo no puede estar vacio")
        .isNumeric().withMessage("Tipo de dato incorrecto para el codigo"),
    getById);

export default router;