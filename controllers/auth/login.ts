import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateTokens } from "../../utils/genToken";
import { PostgresClient } from "../../lib/db";
import { storeRefreshToken } from "../../utils/tokenOps";

const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const client = await PostgresClient.connect()
  const userQuery = await client.query(
    "SELECT * FROM users where email = $1",
    [email]
  );
  const user = userQuery.rows[0];

  await client.release();
  
  if (!user) {
    return res.status(404).json({
      type: "user",
      error: "User with this email does not exists. please register!",
    });
  }

  const isPasswordMatch = bcrypt.compareSync(password, user?.password!);

  if (!isPasswordMatch) {
    return res.status(403).json({
      type: "password",
      error: "Password does not match. Please try again!",
    });
  }

  const id = user?.id;

  const { accessToken, refreshToken } = generateTokens(id);

  await storeRefreshToken(id, refreshToken);

  // Set cookies for access and refresh tokens
  const accessTokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
  const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days

  // Set access token cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // Prevent JavaScript access
    domain: "testimonial-to-one.vercel.app", // Optional: specify only if needed for your environment
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // Secure in production
    expires: accessTokenExpiration, // Set expiration for access token
  });

  // Set refresh token cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // Prevent JavaScript access
    domain: "testimonial-to-one.vercel.app", // Optional: specify only if needed for your environment
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // Secure in production
    expires: refreshTokenExpiration, // Set expiration for refresh token
  });

  res.status(201).json({
    message: "User login successfully. Welcome back to testimonial.to!",
  });
};

export { handleLogin };
