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
const passport_1 = __importDefault(require("passport"));
const passport_github_1 = __importDefault(require("passport-github"));
const config_1 = require("../lib/config");
const genToken_1 = require("../utils/genToken");
const db_1 = require("../lib/db");
const tokenOps_1 = require("../utils/tokenOps");
const githubOauth = passport_github_1.default.Strategy;
passport_1.default.use(new githubOauth({
    clientID: config_1.GITHUB_CLIENT_ID,
    clientSecret: config_1.GITHUB_CLIENT_SECRET,
    callbackURL: `https://testimonial-server.up.railway.app/api/auth/github/callback`,
    scope: ["user:email"], // Request email scope
}, function (accessToken, refreshToken, profile, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield db_1.PostgresClient.connect();
            // Check for existing user by provider_id
            let existingUser = yield client.query("SELECT * FROM users WHERE provider_id = $1", [profile.id]);
            if (existingUser.rows.length > 0) {
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = (0, genToken_1.generateTokens)(existingUser.rows[0].id);
                yield (0, tokenOps_1.storeRefreshToken)(existingUser.rows[0].id, newRefreshToken);
                return cb(null, {
                    user: existingUser.rows[0],
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            }
            // Check if a user with the same email already exists
            const email = profile.emails && profile.emails[0] && profile.emails[0].value;
            const existingEmailUser = yield client.query("SELECT * FROM users WHERE email = $1", [email]);
            if (existingEmailUser.rows.length > 0) {
                // If the email already exists, you can either return the existing user
                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = (0, genToken_1.generateTokens)(existingEmailUser.rows[0].id);
                yield (0, tokenOps_1.storeRefreshToken)(existingEmailUser.rows[0].id, newRefreshToken);
                return cb(null, {
                    user: existingEmailUser.rows[0],
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                });
            }
            // Proceed to insert new user since no duplicate was found
            const newUser = yield client.query("INSERT INTO users (name, email, provider, provider_id) VALUES ($1, $2, $3, $4) RETURNING id", [profile.displayName, email, profile.provider, profile.id]);
            yield client.release(); // Access the first row of the result
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = (0, genToken_1.generateTokens)(newUser.rows[0].id);
            return cb(null, {
                user: newUser.rows[0].id,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        }
        catch (error) {
            return cb(error, undefined);
        }
    });
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const result = yield client.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
        // Check if the user exists
        if (result.rows.length > 0) {
            done(null, result.rows[0]); // Access the first row of the result
        }
        else {
            done(new Error("User not found"), null); // Handle the case where the user is not found
        }
    }
    catch (error) {
        done(error, null);
    }
    finally {
        yield client.release(); // Access the first row of the result
    }
}));
