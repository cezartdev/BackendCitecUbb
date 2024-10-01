import { Router } from "express"
import { body } from "express-validator"
import { handleInputErrors } from "../middleware/index"
import { getAll } from "../handlers/bussinessLine"


const router = Router();

router.get("/get-by-id", getAll)

export default router;