import { Router } from "express";
import { validateRequest } from "../middlewares/bodyvalidate";
import { OTPvalidator, verifyOTPvalidator } from "../validators/OTPvalidator";
import handleSendOTP from "../controllers/mails/sendOTP";
import verifyOTP from "../controllers/mails/verifyOTP";
import resendOTP from "../controllers/mails/resendOTP";

const router = Router();

router.post('/sendmail', validateRequest(OTPvalidator), handleSendOTP)
router.post('/verify', validateRequest(verifyOTPvalidator), verifyOTP)
router.post('/resend', validateRequest(OTPvalidator), resendOTP)

module.exports = router;   