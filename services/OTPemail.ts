import { GOOGLE_APP_PASSWORD } from "../config/config";
import nodemailer from "nodemailer";

const sendOTP = async (email: string, otp: number) => {
  // Create a Nodemailer transporter using your email server's SMTP settings
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "mohdrasheem07@gmail.com", // Your Gmail address
      pass: GOOGLE_APP_PASSWORD, // Your Gmail password or app password
    },
  });

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: "Arial", sans-serif;
        color: #25282c;
        background-color: #f4f4f7;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 40px auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
      }

      .logo img {
        max-width: 150px;
        margin-bottom: 20px;
      }
      .header h1 {
        font-size: 24px;
        color: #5d5dff;
        margin: 0;
      }
      .content {
        padding: 20px 0;
        text-align: center;
      }
      .content h2 {
        font-size: 20px;
        margin-bottom: 10px;
      }
      .content p {
        font-size: 16px;
        line-height: 1.5;
        margin: 0 0 20px;
      }
      .otp {
        display: inline-block;
        font-size: 24px;
        font-weight: bold;
        color: #5d5dff;
        margin: 20px 0;
        padding: 10px 20px;
        border: 2px dashed #5d5dff;
        border-radius: 5px;
        background-color: #f4f4ff;
      }
      .btn {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        font-size: 16px;
        color: #ffffff;
        background-color: #5d5dff;
        border: none;
        border-radius: 5px;
        text-decoration: none;
        cursor: pointer;
      }
      .btn:hover {
        background-color: #4949cc;
      }
      .footer {
        text-align: center;
        font-size: 14px;
        color: #a0a0a0;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
      }
      .footer p {
        margin: 5px 0;
      }
      @media only screen and (max-width: 600px) {
        .container {
          padding: 10px;
        }
        .content {
          padding: 10px 0;
        }
      }

      .logo-design {
        padding: 8px;
        border-radius: 9999px;
        background-color: #5d5dff;
        display: flex;
        max-width: 40px;
        align-items: center;
        color: white;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 0;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo">
          <span class="logo-design"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-thumbs-up h-4 w-4 text-zinc-200 font-bold fill-zinc-200"
            >
              <path d="M7 10v12"></path>
              <path
                d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
              ></path></svg
          ></span>
          Testimonial
        </div>
        <h1>Your OTP Code</h1>
      </div>
      <div class="content">
        <h2>Hello,</h2>
        <p>
          We received a request to access your account. Use the following OTP
          code to complete the process:
        </p>
        <div class="otp">${otp}</div>
        <p>
          If you did not request this code, please ignore this email or contact
          support.
        </p>
        <a href="localhost:3000/otp" class="btn">Verify Now</a>
      </div>
      <div class="footer">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
        <p>123 Your Street, Your City, Your Country</p>
      </div>
    </div>
  </body>
</html>

      `;

  // Email options
  const mailOptions = {
    from: "mohdrasheem07@gmail.com", // Sender's email address
    to: email, // Your Gmail address
    subject: "One Time Password for testimonial.to .",
    html: htmlTemplate,
  };

  // Send email
  await transporter.sendMail(mailOptions);

  return true;
};

export = sendOTP;
