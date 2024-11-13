"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bodyvalidate_1 = require("../middlewares/bodyvalidate");
const OTPvalidator_1 = require("../validators/OTPvalidator");
const sendOTP_1 = __importDefault(require("../controllers/mails/sendOTP"));
const verifyOTP_1 = __importDefault(require("../controllers/mails/verifyOTP"));
const resendOTP_1 = __importDefault(require("../controllers/mails/resendOTP"));
const router = (0, express_1.Router)();
router.post('/sendmail', (0, bodyvalidate_1.validateRequest)(OTPvalidator_1.OTPvalidator), sendOTP_1.default);
router.post('/verify', (0, bodyvalidate_1.validateRequest)(OTPvalidator_1.verifyOTPvalidator), verifyOTP_1.default);
router.post('/resend', (0, bodyvalidate_1.validateRequest)(OTPvalidator_1.OTPvalidator), resendOTP_1.default);
module.exports = router;
