import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { IUser } from "../../types/user";
import { generateTokens } from "../../utils/genToken";
import { storeRefreshToken } from "../../utils/tokenOps";
import { PostgresClient } from "../../config/db";

const handleRegister = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const userResult = await PostgresClient.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  const user = userResult.rows[0]; // Get the first user, if it exists

  if (user) {
    return res.status(404).json({
      type: "user",
      error: "User with this email already exists. Please continue to login!",
    });
  }

  try {
    const newUser = await PostgresClient.query(
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

    // Set cookies
    res.cookie("accessToken", accessToken, {
      path: "/", // Ensure path is set to root
      httpOnly: false, // Allow JavaScript access for development/testing
      secure: false, // Not using HTTPS for local development
      sameSite: "lax",
    });
    res.cookie("refreshToken", refreshToken, {
      path: "/", // Ensure path is set to root
      httpOnly: false, // Allow JavaScript access for development/testing
      secure: false, // Not using HTTPS for local development
      sameSite: "lax",
    });
    res
      .status(201)
      .json({
        message: "User registered successfully. Welcome to testimonial.to!",
      });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ type: "internal", error: error?.message });
  }
};

export { handleRegister };
