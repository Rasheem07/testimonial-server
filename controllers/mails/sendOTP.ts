import { Request, Response } from "express";
import { randomInt } from "crypto";
import sendOTP from "../../services/OTPemail";
import bcrypt from "bcryptjs";
import { PostgresClient } from "../../config/db";

export default async function handleSendOTP(req: Request, res: Response) {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Generate a 6-digit OTP as a number
    const OTP = randomInt(100000, 999999);
    const salt = bcrypt.genSaltSync(10);
    const hashedOTP = bcrypt.hashSync(OTP.toString(), salt);

    // Save the OTP in the database
    await PostgresClient.query("INSERT INTO otps (user, otp) VALUES ($1, $2)", [
      user,
      hashedOTP,
    ]);

    // Send the OTP via email
    const sendmail = await sendOTP(user, OTP);

    if (!sendmail) {
      return res
        .status(500)
        .json({ error: "There was some problem sending the email!" });
    }

    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
}