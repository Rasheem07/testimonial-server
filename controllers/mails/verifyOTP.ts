import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { otp } from "../../types/otp";
import { PostgresClient } from "../../config/db";

export default async function verifyOTP(req: Request, res: Response) {
  const { email, OTP } = req.body;

  const User = await PostgresClient.query(
    "SELECT * FROM otps where user = $1 LIMIT 1",
    [email]
  );

  const isOTPmatch = bcrypt.compareSync(OTP.toString(), User?.rows[0].otp!);

  if (!isOTPmatch) {
    res.status(404).json({ error: "OTP does not match!" });
  }

  await PostgresClient.query("DELETE FROM  otps where user = $1", [email]);
  res.status(202).json({ message: "successfully logined!" });
}
