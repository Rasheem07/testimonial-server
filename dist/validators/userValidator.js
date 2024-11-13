"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginValidator = exports.userValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const regex_1 = require("../utils/regex");
exports.userValidator = joi_1.default.object({
    name: joi_1.default.string().trim().required().messages({
        "string.empty": "Name cannot be empty",
        "any.required": "Name is required",
    }),
    email: joi_1.default.string().email().trim().required().messages({
        "string.email": "Invalid email format",
        "string.empty": "Email cannot be empty",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().min(8).required().messages({
        "string.min": "Password must be at least 8 characters long",
        "string.empty": "Password cannot be empty",
        "any.required": "Password is required",
    }),
});
exports.userLoginValidator = joi_1.default.object({
    email: joi_1.default.string().email().trim().required().messages({
        "string.email": "Invalid email format",
        "string.empty": "Email cannot be empty",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().regex(regex_1.password).min(8).required().messages({
        "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        "string.min": "Password must be at least 8 characters long",
        "string.empty": "Password cannot be empty",
        "any.required": "Password is required",
    }),
});
