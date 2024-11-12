import { PostgresClient } from "../../lib/db";

// Delete text testimonial
export const deleteTextTestimonial = async (id: string | undefined) => {
  const client = await PostgresClient.connect(); 
  try {
    const query = `DELETE FROM text_testimonials WHERE id = $1 RETURNING *;`;
    const result = await client.query(query, [id]);
    if (result.rows.length === 0) {
      throw new Error("Testimonial not found.");
    }
    return result.rows[0]; // Return the deleted row
  } catch (err) {
    console.error("Error deleting text testimonial: ", err);
    throw new Error("Failed to delete text testimonial.");
  } finally {
    client.release();
  }
};

// Delete video testimonial
export const deleteVideoTestimonial = async (id: string | undefined) => {
  const client = await PostgresClient.connect();
  try {
    const query = `DELETE FROM video_testimonials WHERE id = $1 RETURNING *;`;
    const result = await client.query(query, [id]);
    if (result.rows.length === 0) {
      throw new Error("Testimonial not found.");
    }
    return result.rows[0]; // Return the deleted row
  } catch (err) {
    console.error("Error deleting video testimonial: ", err);
    throw new Error("Failed to delete video testimonial.");
  } finally {
    client.release();
  }
};

// Delete social testimonial
export const deleteSocialTestimonial = async (id: string | undefined) => {
  const client = await PostgresClient.connect();
  try {
    const query = `DELETE FROM social_testimonials WHERE id = $1 RETURNING *;`;
    const result = await client.query(query, [id]);
    if (result.rows.length === 0) {
      throw new Error("Testimonial not found.");
    }
    return result.rows[0]; // Return the deleted row
  } catch (err) {
    console.error("Error deleting social testimonial: ", err);
    throw new Error("Failed to delete social testimonial.");
  } finally {
    client.release();
  }
};
