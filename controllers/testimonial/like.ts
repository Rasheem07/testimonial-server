import { Request, Response } from "express";
import { PostgresClient } from "../../lib/db";
import { redisClient } from "../../lib/redis";

export const GetAllLikedtestimonials = async (req: Request, res: Response) => {
  const { space_name } = req.params;

  const client = await PostgresClient.connect();
  try {

    const cachedData = await redisClient.get(`${space_name}/testimonials`);

    if (cachedData) {
      console.log("Cache hit: Returning data from Redis");
      const parsedData = await JSON.parse(cachedData); // Return cached data
      const likedTestimonials = parsedData.filter((testimonial: any) => testimonial.is_liked)
      return res.json(likedTestimonials);
    }

    const likedTestimonials = await client.query(`
      SELECT 
        name, 
        date, 
        ratings, 
        content, 
        NULL AS video_url,
        spacename,
        'text' AS type
      FROM text_testimonials 
      WHERE spacename = $1 AND is_liked = TRUE

      UNION ALL

      SELECT 
        name, 
        date, 
        ratings, 
        NULL AS content, 
        video_url,
        spacename,
        'video' AS type
      FROM video_testimonials 
      WHERE spacename = $1 AND is_liked = TRUE
      
      ORDER BY date; -- Order all testimonials by date
    `, [space_name]);

    res.json(likedTestimonials.rows);
  } catch (error: any) {
    res.status(500).json({ error: error?.message! });
  } finally {
    client.release();
  }
};

export const HandleToggleLike = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  const client = await PostgresClient.connect();
  try {
    await client.query('BEGIN');

    // Query to check the existence of the testimonial in both tables
    const checkResult = await client.query(
      `
      SELECT 
        'text' AS type, spacename, is_liked FROM text_testimonials WHERE id = $1
      UNION ALL
      SELECT 
        'video' AS type, spacename, is_liked FROM video_testimonials WHERE id = $1;
      `,
      [id]
    );

    if (checkResult.rowCount === 0) {
      // If the testimonial is not found in either table, rollback and send a 404
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    const testimonial = checkResult.rows[0];
    let toggleResult;

    if (testimonial.type === 'text') {
      // Toggle is_liked in the text_testimonials table
      toggleResult = await client.query(
        `
        UPDATE text_testimonials 
        SET is_liked = NOT is_liked
        WHERE id = $1
        RETURNING is_liked;
        `,
        [id]
      );
    } else {
      // Toggle is_liked in the video_testimonials table
      toggleResult = await client.query(
        `
        UPDATE video_testimonials 
        SET is_liked = NOT is_liked
        WHERE id = $1
        RETURNING is_liked;
        `,
        [id]
      );
    }

    // Fetch the cached data from Redis
    const cachedData = await redisClient.get(`${testimonial.spacename}/testimonials`);
    
    if (cachedData) {
      console.log("Cache hit: Returning data from Redis");

      // Parse the cached data
      const parsedData = JSON.parse(cachedData);

      // Update the testimonial in the cache
      const updatedData = parsedData.map((item: any) => {
        // If the item ID matches, update the is_liked status
        if (item.id === id) {
          item.is_liked = toggleResult.rows[0].is_liked;
        }
        return item;
      });

      // Save the updated data back to Redis
      await redisClient.set(`${testimonial.spacename}/testimonials`, JSON.stringify(updatedData));
    }

    // Commit the transaction
    await client.query('COMMIT');

    // Return the response with the new like status
    return res.json({ is_liked: toggleResult.rows[0].is_liked });

  } catch (error: any) {
    // Rollback in case of any error
    await client.query('ROLLBACK');
    return res.status(500).json({ error: error.message });
  } finally {
    // Release the client
    client.release();
  }
};


