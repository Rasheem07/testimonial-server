"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = require("../controllers/auth/login");
const bodyvalidate_1 = require("../middlewares/bodyvalidate");
const userValidator_1 = require("../validators/userValidator");
const signup_1 = require("../controllers/auth/signup");
const refreshToken_1 = require("../middlewares/refreshToken");
const passport_1 = __importDefault(require("passport"));
const tokenOps_1 = require("../utils/tokenOps");
const router = express_1.default.Router();
router.post("/register", (0, bodyvalidate_1.validateRequest)(userValidator_1.userValidator), signup_1.handleRegister);
router.post("/login", login_1.handleLogin);
router.get("/refresh-token", refreshToken_1.refreshToken);
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", { session: false, failureRedirect: '/' }), // Disable session if using JWT
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        const { user, accessToken, refreshToken } = req.user;
        yield (0, tokenOps_1.storeRefreshToken)(user, refreshToken);
        // Set cookies for access and refresh tokens
        const accessTokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes 
        const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days
        // Set access token cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true, // Prevent JavaScript access
            domain: "testimonial-to-one.vercel.app", // Optional: specify only if needed for your environment
            path: "/",
            sameSite: "none",
            secure: true, // Secure in production
            expires: accessTokenExpiration, // Set expiration for access token
        });
        // Set refresh token cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // Prevent JavaScript access
            domain: "testimonial-to-one.vercel.app", // Optional: specify only if needed for your environment
            path: "/",
            sameSite: "none",
            secure: true, // Secure in production
            expires: refreshTokenExpiration, // Set expiration for refresh token
        });
        res.json(accessToken);
        res.redirect(`https://testimonial-to-one.vercel.app/dashboard`);
    }
    else {
        res.status(401).json({ message: "Authentication failed" });
    }
}));
router.get("/github", passport_1.default.authenticate("github", { scope: ["profile", "email"] }));
router.get("/github/callback", passport_1.default.authenticate("github", { session: false }), // Disable session if using JWT
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        const { user, accessToken, refreshToken } = req.user;
        yield (0, tokenOps_1.storeRefreshToken)(user, refreshToken);
        // Set cookies for access and refresh tokens
        const accessTokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
        const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days
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
    }
    else {
        res.status(401).json({ message: "Authentication failed" });
    }
}));
//fetch this onmount in reactjs
router.get('/status', (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res.status(401).json({ message: "user is unauthorized!" });
        //redirect to login page in client 
    }
    res.status(200).json({ message: "user is authorized to access this content!" });
});
module.exports = router;
