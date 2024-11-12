import { Pool } from "pg";
import { createSchema } from "../utils/shema";
import { userSchema } from "../schemas/user";
import { OTPschema } from "../schemas/otp";
import { createSpaceSchema } from "../schemas/space";
import {
  socialTestimonialSchema,
  textTestimonialSchema,
  videoTestimonialSchema,
} from "../schemas/testimonial";
 
// Create a new PostgreSQL client
export const PostgresClient = new Pool({
  user: "neondb_owner", // Replace with your PostgreSQL username
  host: "ep-wispy-sea-a5okubxl-pooler.us-east-2.aws.neon.tech",
  database: "neondb", // Replace with your database name
  password: "UD8XwLl2yAMb",
  ssl: true,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
  min: 0,
  max: 10,
  keepAlive: true
});

const setupDatabase = async () => {
  await createSchema(userSchema);
  await createSchema(OTPschema);
  await createSpaceSchema();
  await createSchema(textTestimonialSchema);
  await createSchema(videoTestimonialSchema);
  await createSchema(socialTestimonialSchema);
};

export const connectToPostgresDatabase = async () => {
  const client = await PostgresClient.connect();
  try {
    console.log("Connected to PostgreSQL");
    await setupDatabase(); // Call setupDatabase after successful connection
  } catch (err: any) {
    console.error("Error setting up PostgreSQL", err.stack);
  } finally {
    client.on("error", () => null);
    // Optionally end the pool after initialization if not needed for further queries
    await client.release();
  }
};
