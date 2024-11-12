import { PostgresClient } from "../../lib/db";
import { redisClient } from "../../lib/redis";

// Fetch all text testimonials
export const fetchAllTextTestimonials = async (space_name: string | undefined) => {
  const client = await PostgresClient.connect();
  
  try {
    const query = `SELECT *, 'text' AS type FROM text_testimonials where spacename = $1;`;
    const result = await client.query(query, [space_name]);
    return result.rows; // Return all text testimonials
  } catch (err) {
    console.error("Error fetching text testimonials: ", err);
    throw new Error("Failed to fetch text testimonials.");
  } finally {
    client.release();
  }
};

// Fetch all video testimonials
export const fetchAllVideoTestimonials = async (name: string | undefined) => {
  const client = await PostgresClient.connect();
  try {
    const query = `SELECT *, 'video' AS type FROM video_testimonials where spacename = $1`;
    const result = await client.query(query, [name]);
    return result.rows; // Return all video testimonials
  } catch (err) {
    console.error("Error fetching video testimonials: ", err);
    throw new Error("Failed to fetch video testimonials.");
  } finally {
    client.release()
  }
};

// Fetch all testimonials
export const fetchAllTestimonials = async (space_name: string | undefined) => {
  const client = await PostgresClient.connect();

  const cachedData = await redisClient.get(`${space_name}/testimonials`);
  if (cachedData) {
    console.log("Cache hit: Returning data from Redis");
    return JSON.parse(cachedData); // Return cached data
  }

  try {
    const query = `
      SELECT 
        id,
        name, 
        date, 
        ratings, 
        content, 
        is_liked,
        NULL AS video_url,
        spacename,
        'text' AS type
      FROM text_testimonials 
      WHERE spacename = $1

      UNION ALL

      SELECT 
        id,
        name, 
        date, 
        ratings, 
        NULL AS content, 
        is_liked,
        video_url,
        spacename,
        'video' AS type
      FROM video_testimonials 
      WHERE spacename = $1
      
      ORDER BY date; -- Order all testimonials by date
    `;
    
    const result = await client.query(query, [space_name]);
    await redisClient.setEx(`${space_name}/testimonials`, 3600, JSON.stringify(result.rows));
    return result.rows; // Return all testimonials, with type included and ordered by date
  } catch (err) {
    console.error("Error fetching testimonials: ", err);
    throw new Error("Failed to fetch testimonials.");
  } finally {
    client.release();
  }
};



// Fetch all social testimonials
export const fetchAllSocialTestimonials = async (id: string | undefined) => {
  const client = await PostgresClient.connect();
  try {
    const query = `SELECT * FROM social_testimonials where space_id = $1`;
    const result = await client.query(query, [id]);
    return result.rows; // Return all social testimonials
  } catch (err) {
    console.error("Error fetching social testimonials: ", err);
    throw new Error("Failed to fetch social testimonials.");
  } finally {
    client.release();
  }
};
