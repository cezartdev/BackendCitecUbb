import {Router} from "express"
import {body} from "express-validator"
import {createUser} from "../handlers/User"

const router = Router();

router.post("/create",createUser) 




export default router;