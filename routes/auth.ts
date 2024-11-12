import express from "express";
import { handleLogin } from "../controllers/auth/login";
import { validateRequest } from "../middlewares/bodyvalidate";
import { userValidator } from "../validators/userValidator";
import { handleRegister } from "../controllers/auth/signup"; 
import { refreshToken } from "../middlewares/refreshToken";
import passport from "passport";
import { IUser } from "../types/user";
import { storeRefreshToken } from "../utils/tokenOps";
const router = express.Router(); 

router.post("/register", validateRequest(userValidator), handleRegister);
router.post("/login", handleLogin);
router.get("/refresh-token", refreshToken);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: '/'}), // Disable session if using JWT
  async (req: express.Request, res: express.Response) => {
    if (req.user) {
      const { user, accessToken, refreshToken } = req.user as any;

      await storeRefreshToken(user, refreshToken);

      // Set cookies for access and refresh tokens
      const accessTokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes 
      const refreshTokenExpiration = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ); // Expires in 7 days



      // Set access token cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true, // Prevent JavaScript access
        domain: "testimonial-to-one.vercel.app", // Optional: specify only if needed for your environment
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // Secure in production
        expires: accessTokenExpiration, // Set expiration for access token
      });

      // Set refresh token cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevent JavaScript access
        domain: "testimonial-to-one.vercel.app", // Optional: specify only if needed for your environment
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // Secure in production
        expires: refreshTokenExpiration, // Set expiration for refresh token
      });
      res.redirect(`https://testimonial-to-one.vercel.app/dashboard`);
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
  async (req: express.Request, res: express.Response) => {
    if (req.user) {
      const { user, accessToken, refreshToken } = req.user as any;

      await storeRefreshToken(user, refreshToken);

      // Set cookies for access and refresh tokens
      const accessTokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
      const refreshTokenExpiration = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ); // Expires in 7 days

      // Set access token cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true, // Prevent JavaScript access
        domain: "testimonial-to-one.vercel.app", // Optional: specify only if needed for your environment
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // Secure in production
        expires: accessTokenExpiration, // Set expiration for access token
      });

      // Set refresh token cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // Prevent JavaScript access
        domain: "testimonial-to-one.vercel.app", // Optional: specify only if needed for your environment
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // Secure in production
        expires: refreshTokenExpiration, // Set expiration for refresh token
      });
      res.redirect(`https://testimonial-to-one.vercel.app/dashboard`);
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  }
);

//fetch this onmount in reactjs
router.get('/status', (req : express.Request, res: express.Response) => {
  const {refreshToken} = req.cookies;

  if(!refreshToken) {
    return res.status(401).json({message: "user is unauthorized!"});
    //redirect to login page in client 
  }

  res.status(200).json({message: "user is authorized to access this content!"})
})

module.exports = router;
