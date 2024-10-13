import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateTokens } from "../../utils/genToken";
import { storeRefreshToken } from "../../utils/tokenOps";
import { PostgresClient } from "../../config/db";

const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userQuery = await PostgresClient.query(
    "SELECT * FROM users where email = $1",
    [email]
  );
  const user = userQuery.rows[0];

  if (!user.rows[0]) {
    return res.status(404).json({
      type: "user",
      error: "User with this email does not exists. please register!",
    });
  }

  const isPasswordMatch = bcrypt.compareSync(password, user?.password!);

  if (!isPasswordMatch) {
    return res
      .status(403)
      .json({
        type: "password",
        error: "Password does not match. Please try again!",
      });
  }

  const id = user?.id;

  const { accessToken, refreshToken } = generateTokens(id);

  await storeRefreshToken(id, refreshToken);

  // Set cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    domain: "localhost:3000", // Replace with the client's domain
    path: "/",
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    domain: "localhost:3000", // Replace with the client's domain
    path: "/",
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });
  res
    .status(201)
    .json({
      message: "User login successfully. Welcome back to testimonial.to!",
    });
};

export { handleLogin };
