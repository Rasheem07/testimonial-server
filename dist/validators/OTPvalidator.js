"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTPvalidator = exports.OTPvalidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.OTPvalidator = joi_1.default.object({
    user: joi_1.default.string().email().trim().required().messages({
        "string.email": "Invalid email format",
        "string.empty": "Email cannot be empty",
        "any.required": "Email is required",
    }),
});
exports.verifyOTPvalidator = joi_1.default.object({
    user: joi_1.default.string().email().trim().required().messages({
        "string.email": "Invalid email format",
        "string.empty": "Email cannot be empty",
        "any.required": "Email is required",
    }),
    OTP: joi_1.default.number().integer().min(100000).max(999999).required().messages({
        "number.base": "otp should be a number",
        "number.empty": "otp cannot be empty",
        "any.required": "otp is required",
        "number.integer": "otp should be an integer",
        "number.min": "otp should be at least 6 digits",
        "number.max": "otp should not exceed 6 digits"
    })
});
