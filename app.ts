import express, { Application, NextFunction, Request, Response } from "express";
import { connectToPostgresDatabase, PostgresClient } from "./lib/db";
import { connectToRedis } from "./lib/redis"; 
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
import "./lib/config";
import { globalErrorHandling } from "./errors/global";
//express middlewares
const app: Application = express(); 

//config the cors
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
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
  windowMs: 1 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply the rate limiter to all requests
app.use(limiter);
 
// Basic route 
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world from " + process.env.PORT);
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
app.use('/api/space', require("./routes/space"));
app.use("/api/otp", require("./routes/otp"));
 
//error handling
app.use(globalErrorHandling);

connectToPostgresDatabase();
// insertAllData(spaceData, thankYouData, extraSettingsData);


// Call the function to insert data 

connectToRedis();

export default app;
