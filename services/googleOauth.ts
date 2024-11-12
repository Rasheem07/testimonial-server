import passport from "passport";
import google_Oauth from "passport-google-oauth20";
import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_SECRET_ID,
} from "../lib/config";
// import user from "../schemas/user";
import { generateTokens } from "../utils/genToken";
import { PostgresClient } from "../lib/db";
import { storeRefreshToken } from "../utils/tokenOps";

const GoogleStrategy = google_Oauth.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH_SECRET_ID,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const client = await PostgresClient.connect()
        // Check for existing user by provider_id
        let existingUser = await client.query(
          "SELECT * FROM users WHERE provider_id = $1",
          [profile.id]
        );

        if (existingUser.rows.length > 0) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            generateTokens(existingUser.rows[0].id);
          await storeRefreshToken(existingUser.rows[0].id, newRefreshToken);

          return cb(null, {
            user: existingUser.rows[0],
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        }

        // Check if a user with the same email already exists
        const email = profile.emails && profile.emails[0] && profile.emails[0].value;
        const existingEmailUser = await client.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (existingEmailUser.rows.length > 0) {
          // If the email already exists, you can either return the existing user
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            generateTokens(existingEmailUser.rows[0].id);

          await storeRefreshToken(
            existingEmailUser.rows[0].id,
            newRefreshToken
          );

          return cb(null, {
            user: existingEmailUser.rows[0],
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        }

        // Proceed to insert new user since no duplicate was found
        const newUser = await client.query(
          "INSERT INTO users (name, email, provider, provider_id) VALUES ($1, $2, $3, $4) RETURNING id",
          [profile.displayName, email, profile.provider, profile.id]
        );

        await client.release();// Access the first row of the result

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          generateTokens(newUser.rows[0].id);

        return cb(null, {
          user: newUser.rows[0].id,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });


      } catch (error) {
        return cb(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const client = await PostgresClient.connect()
  try {

    const result = await client.query(
      "SELECT * FROM users WHERE id = $1 LIMIT 1",
      [id]
    );

    // Check if the user exists
    if (result.rows.length > 0) {
      done(null, result.rows[0]); 
    } else {
      done(new Error("User not found"), null); // Handle the case where the user is not found
    }
  } catch (error) {
    done(error, null);
  } finally {
    await client.release();// Access the first row of the result
  }
});
