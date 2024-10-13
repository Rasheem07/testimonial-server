import express, { Application, NextFunction, Request, Response } from "express";
import { connectToPostgresDatabase, PostgresClient } from "./config/db";
import { connectToRedis } from "./config/redis";
import "./services/googleOauth";
import "./services/githubOauth";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import csrf from "csurf";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { authenticateToken } from "./middlewares/authenticateToken";
import cors from "cors";
import  bodyParser from 'body-parser';
//plugins
import "./config/config";
import { globalErrorHandling } from "./errors/global";
import { insertAllData } from "./services/InsertTestimonial";
import { ExtraSettingsData, SpaceData, ThankYouData } from "./types/testimonial";

//express middlewares
const app: Application = express();

//config the cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
    allowedHeaders: ["Content-Type", "Authorization", "xsrf-token","X-CSRF-Token"],
  })
);

// Session and Passport initialization
app.use(
  session({
    secret: "ssdnksajdbv2iy8eui2qehas",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//data parsing
app.use(express.json()); // For parsing JSON payloads
app.use(cookieParser());
var parseForm = bodyParser.urlencoded({ extended: false })

// CSRF protection middleware
const csrfProtection = csrf({
  cookie: true
});

//helmet protection
app.use(helmet());


// Create a rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

const spaceData = {
  name: "My sas Space",
  logo: "/images/logo.png",
  header_title: "Welcome to My Space",
  custom_message: "Enjoy your stay!",
  questions: [
    { question: "What do you think?", order_no: 1 },
    { question: "What do you think?", order_no: 2 },
    { question: "What do you think?", order_no: 3 },
    // Add more questions here if needed
  ],
  collect_extra: {
    email: true,
    title_company: true,
    social_link: false,
    address: false
  },
  collection_type: "text and video",
  collect_star_ratings: true,
  allow_custom_btn_color: false,
  custom_btn_color: "#FF5733",
  language: "english"
};

const thankYouData: ThankYouData = {
  image: "/gifs/thankyou.gif",
  title: "THANK YOU!",
  message: "Thank you so much for your shoutout! It means a ton for us! 🙏",
  allow_social: false,
  redirect_url: null,
  reward_video: false
};

const extraSettingsData: ExtraSettingsData = {
  max_duration: 120,
  max_char: 0,
  video_btn_text: "Record a video",
  text_btn_text: "Send in text",
  consent_display: "required",
  consent_statement: "I give permission to use this testimonial",
  text_submission_title: "Title",
  questions_label: "Questions",
  default_text_testimonial_avatar: null,
  affiliate_link: null,
  third_party: {
    name: "google",
    link: "https://google.com"
  },
  auto_populate_testimonials_to_the_wall_of_love: true,
  disable_video_recording_for_iphone_users: false,
  allow_search_engines_to_index_your_page: true
};
// Apply the rate limiter to all requests
app.use(limiter);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});
 
// Route to serve the CSRF token
app.get("/get/csrf-token", parseForm, csrfProtection, (req: Request, res: Response) => {
  try {
    const token = req.csrfToken(); 
    res.cookie("csrfToken", token, {
      path: "/", // Ensure path is set to root 
      httpOnly: false, // Allow JavaScript access for development/testing
      secure: false, // Not using HTTPS for local development
      sameSite: "lax",
      maxAge: 3600 * 1000, // 1 hour 
    });
    res.status(201).json({message: "succesfully sent!"})
  } catch (error) {
    res.status(500).json({ error: "Failed to get CSRF token" });
  }
});

// Route to handle form submission
app.post("/submit", authenticateToken, (req: Request, res: Response) => {
  // CSRF token is validated automatically by csrfProtection middleware
  res.status(201).json({ message: "Form submitted successfully!" });
});

app.use("/api/auth", require("./routes/auth"));
// app.use('/api/testimonial', require("./routes/testimonial"));
app.use("/api/otp", require("./routes/otp"));

//error handling
app.use(globalErrorHandling);

connectToPostgresDatabase();
// insertAllData(spaceData, thankYouData, extraSettingsData);


// Call the function to insert data

connectToRedis();

export default app;
