import passport from "passport";
import github_Oauth from "passport-github";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "../config/config";
import { generateTokens } from "../utils/genToken";
import { PostgresClient } from "../config/db";

const githubOauth = github_Oauth.Strategy;

passport.use(
  new githubOauth(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email"], // Request email scope
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const email =
          profile.emails && profile.emails[0] && profile.emails[0].value;

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
