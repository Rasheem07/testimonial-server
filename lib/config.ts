import dotenv from 'dotenv';
dotenv.config();
 
const mongoURI = process.env.MONGO_URI as string;
const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN!;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN!;
const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD!;
const GOOGLE_OAUTH_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID!;
const GOOGLE_OAUTH_SECRET_ID = process.env.GOOGLE_OAUTH_SECRET_ID!;
const GITHUB_CLIENT_SECRET =  process.env.GITHUB_CLIENT_SECRET!;
const GITHUB_CLIENT_ID =  process.env.GITHUB_CLIENT_ID!;
const supabase_url = process.env.SUPABASE_URL!;
const supabase_key = process.env.SUPABASE_API_KEY!;

export {
  mongoURI,
  JWT_ACCESS_TOKEN,
  JWT_REFRESH_TOKEN,
  GOOGLE_APP_PASSWORD,
  GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_SECRET_ID,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  supabase_url,
  supabase_key
};
