import {  PostgresClient } from "../../lib/db";

export const fetchAllTestimonialspace = async (userId: string | undefined) => {
  const client = await PostgresClient.connect();
  try {
    // Query to join tables and select all fields, while grouping text and video testimonials into arrays
    const query = `
      SELECT 
        spaces.id AS space_id,
        spaces.user_id,
        spaces.space_name,
        spaces.logo,
        spaces.header_title,
        spaces.custom_message,
        spaces.questions,
        spaces.collect_extra,
        spaces.collection_type,
        spaces.collect_star_ratings,
        spaces.allow_custom_btn_color,
        spaces.custom_btn_color,
        spaces.language,
        thank_page.image AS thank_page_image,
        thank_page.title AS thank_page_title,
        thank_page.message AS thank_page_message,
        thank_page.allow_social,
        thank_page.redirect_url,
        thank_page.reward_video,
        extra_settings.max_duration,
        extra_settings.max_char,
        extra_settings.video_btn_text,
        extra_settings.text_btn_text,
        extra_settings.consent_display,
        extra_settings.consent_statement,
        extra_settings.text_submission_title,
        extra_settings.questions_label,
        extra_settings.default_text_testimonial_avatar,
        extra_settings.affiliate_link,
        extra_settings.third_party,
        extra_settings.auto_populate_testimonials_to_the_wall_of_love,
        extra_settings.disable_video_recording_for_iphone_users,
        extra_settings.allow_search_engines_to_index_your_page,
        COALESCE(text_testimonials.texts, '{}') AS text_testimonials,  -- Aggregate text testimonials
        COALESCE(video_testimonials.videos, '{}') AS video_testimonials  -- Aggregate video testimonials
      FROM 
        spaces
      LEFT JOIN 
        thank_page ON spaces.id = thank_page.space_id
      LEFT JOIN 
        extra_settings ON spaces.id = extra_settings.space_id
      LEFT JOIN 
        (
          SELECT spacename, ARRAY_AGG(content) AS texts  
          FROM text_testimonials
          GROUP BY spacename
        ) text_testimonials ON spaces.space_name = text_testimonials.spacename 
      LEFT JOIN 
        (
          SELECT spacename, ARRAY_AGG(video_url) AS videos
          FROM video_testimonials
          GROUP BY spacename
        ) video_testimonials ON spaces.space_name = video_testimonials.spacename  -- Subquery for video testimonials
      WHERE 
        spaces.user_id = $1
    `;

    // Execute the query
    const result = await client.query(query, [userId]);

    // Check if any data was returned
    if (result.rows.length === 0) {
      return null;
    }

    return result.rows; // Return the joined data
  } catch (err) {
    console.error("Error fetching joined data: ", err);
    throw new Error("Failed to fetch testimonial space data.");
  } finally {
    client.release();
  }
};
