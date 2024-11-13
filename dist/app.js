"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./lib/db");
const redis_1 = require("./lib/redis");
require("./services/googleOauth");
require("./services/githubOauth");
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const authenticateToken_1 = require("./middlewares/authenticateToken");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
//plugins
require("./lib/config");
const global_1 = require("./errors/global");
//express middlewares
const app = (0, express_1.default)();
//config the cors
app.use((0, cors_1.default)({
    origin: ["https://testimonial-to-one.vercel.app"],
    credentials: true, // Allow cookies to be sent
}));
// Session and Passport initialization
app.use((0, express_session_1.default)({
    secret: "ssdnksajdbv2iy8eui2qehas",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
//data parsing
app.use(express_1.default.json()); // For parsing JSON payloads
app.use((0, cookie_parser_1.default)());
var parseForm = body_parser_1.default.urlencoded({ extended: false });
// CSRF protection middleware 
const csrfProtection = (0, csurf_1.default)({
    cookie: true
});
//helmet protection
app.use((0, helmet_1.default)());
app.set('trust proxy', true);
// Create a rate limiter middleware
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
});
// Enable trust proxy
app.use(limiter);
// Apply the rate limiter to all requests
app.use(limiter);
// Basic route 
app.get("/", (req, res) => {
    res.send("Hello, world from " + process.env.PORT);
});
// Route to serve the CSRF token 
app.get("/get/csrf-token", parseForm, csrfProtection, (req, res) => {
    try {
        const token = req.csrfToken();
        res.cookie("csrfToken", token, {
            path: "/", // Ensure path is set to root  
            httpOnly: false, // Allow JavaScript access for development/testing
            secure: false, // Not using HTTPS for local development
            sameSite: "lax",
            maxAge: 3600 * 1000, // 1 hour  
        });
        res.status(201).json({ message: "succesfully sent!" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get CSRF token" });
    }
});
// Route to handle form submission
app.post("/submit", authenticateToken_1.authenticateToken, (req, res) => {
    // CSRF token is validated automatically by csrfProtection middleware
    res.status(201).json({ message: "Form submitted successfully!" });
});
app.use("/api/auth", require("./routes/auth"));
app.use('/api/space', require("./routes/space"));
app.use("/api/otp", require("./routes/otp"));
//error handling
app.use(global_1.globalErrorHandling);
(0, db_1.connectToPostgresDatabase)();
// insertAllData(spaceData, thankYouData, extraSettingsData);
// Call the function to insert data 
(0, redis_1.connectToRedis)();
exports.default = app;
