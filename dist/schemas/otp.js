"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPschema = void 0;
exports.OTPschema = `
CREATE TABLE IF NOT EXISTS otps (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL REFERENCES users(email),
    otp VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT otp_length CHECK (LENGTH(otp) >= 5), 
    CONSTRAINT otp_expiry CHECK (created_at + INTERVAL '10 minutes' > CURRENT_TIMESTAMP) -- Optional: To enforce expiry at application level
);
`;
