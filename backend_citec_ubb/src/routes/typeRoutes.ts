import {Router} from "express"
import {body} from "express-validator"
import {handleInputErrors} from "../middleware/index"
import {getAll} from "../handlers/type"

const router = Router();


router.get("/get-all",getAll);



export default router;