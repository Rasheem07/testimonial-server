import { NextFunction, Request, Response } from "express";
import { JWT_REFRESH_TOKEN } from "../lib/config"; // Ensure this is set in your config
import jwt from "jsonwebtoken";
import { getStoredRefreshToken, storeRefreshToken } from "../utils/tokenOps"; // Define these functions
import { Payload } from "../types/playload"; // Ensure the type is defined
import { generateTokens } from "../utils/genToken"; // Define this function

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { accessToken: accessTokencookie, refreshToken } = req.cookies;

  // Check for refresh token
  if (!refreshToken) {
    return res.status(401).send("Refresh token is required");
  }

  try {
    // If there's no access token, refresh it
    if (!accessTokencookie) {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_TOKEN) as Payload;
      const storedToken = await getStoredRefreshToken(decoded.user.id);

      if (storedToken !== refreshToken) {
        return res.status(403).send("Invalid refresh token");
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.user.id);

      // Store new refresh token in your storage (like Redis)
      await storeRefreshToken(decoded.user.id, newRefreshToken);

      // Set expiration times for the tokens
      const accessTokenExpiration = new Date(Date.now() + 10 * 60 * 1000); // Expires in 1 minute
      const refreshTokenExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days

      // Set cookies for access and refresh tokens 
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        domain: "testimonial-to-one.vercel.app", // Change if needed
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // Secure in production
        expires: accessTokenExpiration,
      });
      
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        domain: "testimonial-to-one.vercel.app", // Change if needed
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production", // Secure in production
        expires: refreshTokenExpiration,
      });

      req.tokens = {
        accessToken,
        refreshToken: newRefreshToken,
      };
      
      // Continue to the next middleware
      return next();
    } else {
      // If access token exists, continue to the next middleware
      return next();
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).send("Refresh token has expired");
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).send("Invalid refresh token");
    }
    return res.status(500).send("Internal server error");
  }
};

// Type definition for extending the Request interface
declare global {
  namespace Express {
    interface Request {
      tokens?: {
        accessToken: string;
        refreshToken: string;
      };
    }
  }
}