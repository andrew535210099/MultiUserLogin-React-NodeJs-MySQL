import express from "express";
import { login, logOut, Me } from "../controllers/Auth.js";

const router = express.Router();

router.get("/me", Me);
router.post("/login", login);
router.delete("/logout", logOut);

export default router;
// The AuthRoute.js file is a route file that contains the routes for the authentication process. It uses the Express Router to define the routes for the login, logout, and me endpoints. The
