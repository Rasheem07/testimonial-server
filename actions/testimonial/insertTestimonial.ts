import { PostgresClient } from "../../lib/db";
import { redisClient } from "../../lib/redis";
import { uploadImageFile } from "../../uploads/imageUploader";

interface TestimonialData {
  space_name: string;
  image_only: boolean;
  ratings?: number;
  content?: string;
  name?: string;
  is_liked?: boolean;
  is_archived?: boolean;
  date?: string; // Use a consistent date format
}

// Helper function to handle image uploads
const uploadImageFiles = async (
  image_src_param: File | string,
  user_photo_param: File | string
): Promise<[string, string]> => {
  if (image_src_param != typeof String && user_photo_param != typeof String) {
    const [image_src, user_photo] = await Promise.all([
      await uploadImageFile("text_images", image_src_param),
      await uploadImageFile("author_photos", user_photo_param),
    ]);

    return [image_src, user_photo];
  } else {
    return [image_src_param as string, user_photo_param as string]; // Type assertion for string
  }
};

// Insert text testimonial
export const insertTextTestimonial = async (
  image_src_param: File | string,
  user_photo_param: File | string,
  data: TestimonialData
): Promise<any> => {
  const client = await PostgresClient.connect();
  try {
    const [image_src, user_photo] = await uploadImageFiles(
      image_src_param,
      user_photo_param
    );

    const query = `
      INSERT INTO text_testimonials (spacename, image_only, image_src, ratings, content, name, user_photo, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *;
    `;
    const values = [
      data.space_name,
      data.image_only,
      image_src,
      data.ratings,
      data.content,
      data.name,
      user_photo,
      data.date,
    ];

    const result = await client.query(query, values);
    const newTestimonial = result.rows[0]; 
 
    // Fetch and update the cache
    const cachedData = await redisClient.get(`${data.space_name}/testimonials`);
    if (cachedData) {
      const testimonials = JSON.parse(cachedData) as any[];

      // Add the new testimonial and sort by date
      testimonials.push({
        name: newTestimonial.name, 
        date: newTestimonial.date, 
        ratings: newTestimonial.ratings, 
        content: newTestimonial.content, 
        is_liked: newTestimonial.is_liked,
        video_url: null,
        spacename: newTestimonial.spacename,
        type: "text"
      });

      await redisClient.setEx(
        `${data.space_name}/testimonials`,
        3600,
        JSON.stringify(testimonials)
      );
    }

    return newTestimonial;
  } catch (err) {
    console.error("Error inserting text testimonial: ", err);
    throw new Error("Failed to insert text testimonial."); // Keep this concise
  } finally {
    client.release(); // Ensure the client is released
  }
};

// Insert video testimonial
export const insertVideoTestimonial = async (
  video: Express.Multer.File | undefined,
  data: any
) => {
  const client = await PostgresClient.connect();
  try {
    const url = await uploadImageFile("video_testimonials", video);

    if (!url) {
      console.log("error uploading video file");
    }

    const query = `
      INSERT INTO video_testimonials (spacename, video_url, duration, name, ratings)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.space_name,
      url,
      data.duration,
      data.name,
      data.ratings,
    ];

    const result = await client.query(query, values);
    return result.rows[0]; // Return the inserted row
  } catch (err) {
    console.error("Error inserting video testimonial: ", err);
    throw new Error("Failed to insert video testimonial.");
  } finally {
    client.release();
  }
};

// Insert social testimonial
export const insertSocialTestimonial = async (data: any) => {
  const client = await PostgresClient.connect();
  try {
    const query = `
      INSERT INTO social_testimonials (socialId, username, content, social_provider, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [
      data.socialId,
      data.username,
      data.content,
      data.social_provider,
      data.date,
    ];

    const result = await client.query(query, values);
    return result.rows[0]; // Return the inserted row
  } catch (err) {
    console.error("Error inserting social testimonial: ", err);
    throw new Error("Failed to insert social testimonial.");
  } finally {
    client.release();
  }
};
