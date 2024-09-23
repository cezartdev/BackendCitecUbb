import {Router} from "express"
import {body} from "express-validator"
import {createUser} from "../handlers/user"

const router = Router();

router.post("/create",createUser) 




export default router;