import { Request, Response } from "express";
import { JWT_REFRESH_TOKEN } from "../../config/config";
import jwt from "jsonwebtoken";
import { getStoredRefreshToken, storeRefreshToken } from "../../utils/tokenOps";
import { playload } from "../../types/playload";
import { generateTokens } from "../../utils/genToken";

export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).send("Refresh token is required");
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_TOKEN) as playload;
    const storedToken = await getStoredRefreshToken(decoded.user.id);

    if (storedToken !== token) {
      return res.status(403).send("Invalid refresh token");
    }

    const { accessToken, refreshToken } = generateTokens(decoded.user.id);

    // Store new refresh token in Redis
    await storeRefreshToken(decoded.user.id, refreshToken);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      domain: "localhost:3000", // Replace with the client's domain
      path: "/",
      sameSite: "none",
      secure: process.env.NODE_ENV === "production"
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      domain: "localhost:3000", // Replace with the client's domain
      path: "/",
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).send("Invalid refresh token");
  }
};
