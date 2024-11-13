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
exports.refreshToken = void 0;
const config_1 = require("../lib/config"); // Ensure this is set in your config
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenOps_1 = require("../utils/tokenOps"); // Define these functions
const genToken_1 = require("../utils/genToken"); // Define this function
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken: accessTokencookie, refreshToken } = req.cookies;
    // Check for refresh token
    if (!refreshToken) {
        return res.status(401).send("Refresh token is required");
    }
    try {
        // If there's no access token, refresh it
        if (!accessTokencookie) {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, config_1.JWT_REFRESH_TOKEN);
            const storedToken = yield (0, tokenOps_1.getStoredRefreshToken)(decoded.user.id);
            if (storedToken !== refreshToken) {
                return res.status(403).send("Invalid refresh token");
            }
            // Generate new tokens
            const { accessToken, refreshToken: newRefreshToken } = (0, genToken_1.generateTokens)(decoded.user.id);
            // Store new refresh token in your storage (like Redis)
            yield (0, tokenOps_1.storeRefreshToken)(decoded.user.id, newRefreshToken);
            // Set expiration times for the tokens
            const accessTokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // Expires in 1 minute
            const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days
            // Set cookies for access and refresh tokens 
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                domain: "testimonial-to-one.vercel.app", // Change if needed
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production", // Secure in production
                expires: accessTokenExpiration,
            });
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                domain: "testimonial-to-one.vercel.app", // Change if needed
                path: "/",
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production", // Secure in production
                expires: refreshTokenExpiration,
            });
            req.tokens = {
                accessToken,
                refreshToken: newRefreshToken,
            };
            // Continue to the next middleware
            return next();
        }
        else {
            // If access token exists, continue to the next middleware
            return next();
        }
    }
    catch (error) {
        console.error("Error refreshing token:", error);
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(403).send("Refresh token has expired");
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(403).send("Invalid refresh token");
        }
        return res.status(500).send("Internal server error");
    }
});
exports.refreshToken = refreshToken;
