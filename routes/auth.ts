import express from "express";
// import { handleLogin } from "../controllers/auth/login";
import { validateRequest } from "../middlewares/validate";
import { userValidator } from "../validators/userValidator";
import { handleRegister } from "../controllers/auth/signup";
// import { refreshToken } from "../controllers/auth/refreshToken";
import passport from "passport";
import { IUser } from "../types/user";
const router = express.Router();

router.post("/register", validateRequest(userValidator), handleRegister);
// router.post("/login", handleLogin);
// router.get("/refresh-token", refreshToken);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), // Disable session if using JWT
  (req: express.Request, res: express.Response) => {
    if (req.user) {
      const { user, accessToken, refreshToken } = req.user as any;

      // Set cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.redirect(`http://localhost:3000/dashboard`);
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }), // Disable session if using JWT
  (req: express.Request, res: express.Response) => {
    if (req.user) {
      const { user, accessToken, refreshToken } = req.user as any;

      // Set cookies
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      res.redirect(`http://localhost:3000/dashboard`);
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  }
);

module.exports = router;
