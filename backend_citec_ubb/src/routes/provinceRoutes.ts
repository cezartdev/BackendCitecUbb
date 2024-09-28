import {Router} from "express"
import {body} from "express-validator"
import {handleInputErrors} from "../middleware/index"
import {getAll, getById} from "../handlers/province"

const router = Router();


router.get("/get-all",getAll);
router.get("/get-by-id/:id", getById);


export default router;