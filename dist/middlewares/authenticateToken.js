"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../lib/config");
const authenticateToken = (req, res, next) => {
    var _a;
    let token;
    if (req.cookies.accessToken)
        token = req.cookies.accessToken;
    else {
        token = (_a = req.tokens) === null || _a === void 0 ? void 0 : _a.accessToken;
    }
    if (!token) {
        return res.status(401).json({ error: 'Token is not passed!' });
    }
    try {
        const data = jsonwebtoken_1.default.verify(token, config_1.JWT_ACCESS_TOKEN);
        console.log('payload id: ', data);
        if (!data) {
            return res.status(401).json({ error: 'Token cannot be verified!' });
        }
        req.user = data.user;
        next();
    }
    catch (err) {
        console.error('JWT verification error:', err);
        return res.status(403).json({ error: 'Invalid token!' });
    }
};
exports.authenticateToken = authenticateToken;
