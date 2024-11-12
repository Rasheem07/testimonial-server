import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateTokens } from "../../utils/genToken";
import { storeRefreshToken } from "../../utils/tokenOps";
import { PostgresClient } from "../../lib/db";

const handleRegister = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const client = await PostgresClient.connect()

  const userResult = await client.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  await client.release();

  const user = userResult.rows[0]; // Get the first user, if it exists

  if (user) {
    return res.status(404).json({
      type: "user",
      error: "User with this email already exists. Please continue to login!",
    });
  }

  try {
    const client = await PostgresClient.connect();
    const newUser = await client.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );

    if (newUser.rowCount === 0) {
      return res
        .status(500)
        .json({ type: "user", error: "Error saving user!" });
    }

    const id = newUser.rows[0]?.id;

    const { accessToken, refreshToken } = generateTokens(id);

    await storeRefreshToken(id, refreshToken);

    // Set cookies for access and refresh tokens
    const accessTokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes
    const refreshTokenExpiration = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ); // Expires in 7 days

    // Set access token cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevent JavaScript access
      domain: "localhost", // Optional: specify only if needed for your environment
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // Secure in production
      expires: accessTokenExpiration, // Set expiration for access token
    });

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevent JavaScript access
      domain: "localhost", // Optional: specify only if needed for your environment
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // Secure in production
      expires: refreshTokenExpiration, // Set expiration for refresh token
    });
    res.status(201).json({
      message: "User registered successfully. Welcome to testimonial.to!",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ type: "internal", error: error?.message });
  }
};

export { handleRegister };
