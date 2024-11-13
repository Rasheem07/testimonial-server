"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = generateTokens;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../lib/config");
function generateTokens(id) {
    const data = {
        user: {
            id: id
        }
    };
    const accessToken = jsonwebtoken_1.default.sign(data, config_1.JWT_ACCESS_TOKEN, { expiresIn: '11m' });
    const refreshToken = jsonwebtoken_1.default.sign(data, config_1.JWT_REFRESH_TOKEN, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}
;
