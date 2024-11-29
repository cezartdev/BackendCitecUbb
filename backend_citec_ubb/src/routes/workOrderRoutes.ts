import {Router} from "express"
import {body,param} from "express-validator"
import {handleInputErrors} from "../middleware/index"
import {getAll, getById} from "../handlers/workOrder"

const router = Router();


router.get("/get-all",getAll);



router.get("/get-by-id/:id",
    param("id")
        .notEmpty().withMessage("El id no puede estar vacio")
        .isNumeric().withMessage("Tipo de dato incorrecto para el id"),
    getById);


export default router;