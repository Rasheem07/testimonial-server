import Joi from "joi";

export const OTPvalidator = Joi.object({
  
    user: Joi.string().email().trim().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
    }),

});

export const verifyOTPvalidator = Joi.object({
  
    user: Joi.string().email().trim().required().messages({
      "string.email": "Invalid email format",
      "string.empty": "Email cannot be empty",
      "any.required": "Email is required",
    }),

    OTP: Joi.number().integer().min(100000).max(999999).required().messages({
      "number.base": "otp should be a number",
      "number.empty": "otp cannot be empty",
      "any.required": "otp is required",
      "number.integer": "otp should be an integer",
      "number.min": "otp should be at least 6 digits",
      "number.max": "otp should not exceed 6 digits"
    })

});