import {Router} from "express"
import {body} from "express-validator"
import {createUser} from "../handlers/user"
import {handlePasswordEncrypt} from "../middleware/index"

const router = Router();

router.post("/create",handlePasswordEncrypt,createUser) 




export default router;