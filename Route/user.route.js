import express from "express";
import { userSignup, userLogin, allUser} from "../Controllers/user.controller.js";
import userVerify from "../Middlewares/user.auth.js";

const router = express.Router()

router.post('/signup', userSignup)
router.post('/login', userLogin)
router.get("/user", userVerify(['admin', 'user']), allUser)

export default router;