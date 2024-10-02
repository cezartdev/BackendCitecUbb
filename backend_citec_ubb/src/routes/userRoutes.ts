import {Router} from "express"
import {body} from "express-validator"
import {createUser,loginUser,getAll, deleteUser} from "../handlers/user"
import {handleInputErrors, handlePasswordEncrypt} from "../middleware/index"

const router = Router();

router.post("/create",handlePasswordEncrypt,createUser) ;
router.post("/login",
    body("email")
        .notEmpty().withMessage("El email no puede estar vacío")
        .isEmail().withMessage("El email no está en el formato correcto"),
    body("contraseña")
        .notEmpty().withMessage("La contraseña esta vacía"),
    handleInputErrors,
    loginUser);

router.get("/get-all", getAll);
router.delete("/delete/:id", deleteUser);

export default router;