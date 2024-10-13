import { Request, Response } from "express";
import { randomInt } from "crypto";
import sendOTP from "../../services/OTPemail";
import bcrypt from "bcryptjs";
import { PostgresClient } from "../../config/db";

export default async function resendOTP(req: Request, res: Response) {
  const { user } = req.body;

  try {
    const User = await PostgresClient.query(
      "SELECT * FROM users where email = $1 LIMIT 1",
      [user]
    );

    if (!User.rows[0]) {
      return res
        .status(403)
        .json({ error: "User with this email does not exist!" });
    }

    await PostgresClient.query("DELETE FROM otps where user = $1", [
      User.rows[0].email,
    ]);

    const OTP = randomInt(100000, 999999);
    const salt = bcrypt.genSaltSync(10);
    const hashedOTP = bcrypt.hashSync(OTP.toString(), salt);

    await PostgresClient.query("INSERT INTO otps (user, otp) VALUES ($1, $2)", [
      User.rows[0].email,
      hashedOTP,
    ]);

    const sendmail = await sendOTP(user, OTP);

    if (!sendmail) {
      return res
        .status(500)
        .json({ error: "There was some problem sending the email!" });
    }

    res.status(201).json({ message: "OTP resent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while resending the OTP" });
  }
}
