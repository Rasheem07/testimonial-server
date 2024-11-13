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
exports.handleRegister = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const genToken_1 = require("../../utils/genToken");
const tokenOps_1 = require("../../utils/tokenOps");
const db_1 = require("../../lib/db");
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, email, password } = req.body;
    const salt = bcryptjs_1.default.genSaltSync(10);
    const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
    const client = yield db_1.PostgresClient.connect();
    const userResult = yield client.query("SELECT * FROM users WHERE email = $1", [email]);
    yield client.release();
    const user = userResult.rows[0]; // Get the first user, if it exists
    if (user) {
        return res.status(404).json({
            type: "user",
            error: "User with this email already exists. Please continue to login!",
        });
    }
    try {
        const client = yield db_1.PostgresClient.connect();
        const newUser = yield client.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)", [name, email, hashedPassword]);
        if (newUser.rowCount === 0) {
            return res
                .status(500)
                .json({ type: "user", error: "Error saving user!" });
        }
        const id = (_a = newUser.rows[0]) === null || _a === void 0 ? void 0 : _a.id;
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
            message: "User registered successfully. Welcome to testimonial.to!",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ type: "internal", error: error === null || error === void 0 ? void 0 : error.message });
    }
});
exports.handleRegister = handleRegister;
