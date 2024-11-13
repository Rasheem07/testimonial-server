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
exports.handleLogin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const genToken_1 = require("../../utils/genToken");
const db_1 = require("../../lib/db");
const tokenOps_1 = require("../../utils/tokenOps");
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const client = yield db_1.PostgresClient.connect();
    const userQuery = yield client.query("SELECT * FROM users where email = $1", [email]);
    const user = userQuery.rows[0];
    yield client.release();
    if (!user) {
        return res.status(404).json({
            type: "user",
            error: "User with this email does not exists. please register!",
        });
    }
    const isPasswordMatch = bcryptjs_1.default.compareSync(password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatch) {
        return res.status(403).json({
            type: "password",
            error: "Password does not match. Please try again!",
        });
    }
    const id = user === null || user === void 0 ? void 0 : user.id;
    const { accessToken, refreshToken } = (0, genToken_1.generateTokens)(id);
    yield (0, tokenOps_1.storeRefreshToken)(id, refreshToken);
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
    res.status(201).json({
        message: "User login successfully. Welcome back to testimonial.to!",
    });
});
exports.handleLogin = handleLogin;
