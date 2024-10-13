import { Pool } from 'pg';
import { createSchema } from '../utils/shema';
import { userSchema } from '../schemas/user';
import { OTPschema } from '../schemas/otp';
import { createSpaceSchema } from '../schemas/testimonial';

// Create a new PostgreSQL client
export const PostgresClient = new Pool({
    user: 'neondb_owner',    // Replace with your PostgreSQL username
    host: 'ep-wispy-sea-a5okubxl-pooler.us-east-2.aws.neon.tech',
    database: 'neondb',   // Replace with your database name
    password: 'UD8XwLl2yAMb', 
    ssl: true
});


const setupDatabase = async () => {
    await createSchema(userSchema);
    await createSchema(OTPschema);
    await createSpaceSchema();
};


export const connectToPostgresDatabase = async () => {
  try {
      await PostgresClient.connect();
      console.log('Connected to PostgreSQL');
      await setupDatabase(); // Call setupDatabase after successful connection
  } catch (err: any) {
      console.error('Error connecting to PostgreSQL', err.stack);
  }
};