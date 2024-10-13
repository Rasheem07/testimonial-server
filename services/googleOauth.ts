import passport from "passport";
import google_Oauth from "passport-google-oauth20";
import {
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_SECRET_ID,
} from "../config/config";
// import user from "../schemas/user";
import { generateTokens } from "../utils/genToken";
import { PostgresClient } from "../config/db";

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
        let existingUser = await PostgresClient.query(
          "SELECT * FROM users where provider_id = $1",
          [profile.id]
        );

        if (existingUser) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            generateTokens(existingUser.rows[0].id);
          return cb(null, {
            user: existingUser,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        }

        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value;

        const newUser = await PostgresClient.query(
          "INSERT INTO users (name, email, provider, provider_id) VALUES ($1, $2, $3, $4)",
          [profile.username, email, profile.provider, profile.id]
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          generateTokens(newUser.rows[0].id);

        return cb(null, {
          user: newUser,
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
  try {
    const newuser = await PostgresClient.query(
      "SELECT * FROM users where id = $1 LIMIT 1",
      [id]
    );

    done(null, newuser);
  } catch (error) {
    done(error, null);
  }
});
