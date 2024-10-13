import { PostgresClient } from "../config/db";
import {
  ExtraSettingsData,
  SpaceData,
  ThankYouData,
} from "../types/testimonial";

export const insertAllData = async (
  spaceData: SpaceData,
  thankYouData: ThankYouData,
  extraSettingsData: ExtraSettingsData
) => {
  const client = await PostgresClient.connect();
  try {
    // Start transaction
    await client.query("BEGIN");

    // Step 1: Insert into the space table
    const spaceInsertQuery = `
      INSERT INTO spaces (
        name,
        logo,
        header_title,
        custom_message,
        questions,
        collect_extra,
        collection_type,
        collect_star_ratings,
        allow_custom_btn_color,
        custom_btn_color,
        language
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING id;
    `;

    const spaceValues = [
      spaceData.name,
      spaceData.logo,
      spaceData.header_title,
      spaceData.custom_message,
      JSON.stringify(spaceData.questions),
      JSON.stringify(spaceData.collect_extra),
      spaceData.collection_type,
      spaceData.collect_star_ratings, 
      spaceData.allow_custom_btn_color,
      spaceData.custom_btn_color,
      spaceData.language,
    ];
    
    const spaceResult = await client.query(spaceInsertQuery, spaceValues);
    const spaceId = spaceResult.rows[0].id; // Get the generated space ID

    // Step 2: Insert into the thank_you_page table
    const thankYouInsertQuery = `
      INSERT INTO thank_page (
        space_id,
        image,
        title,
        message,
        allow_social,
        redirect_url,
        reward_video
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
    
    const thankYouValues = [
      spaceId, // Use the generated space ID
      thankYouData.image,
      thankYouData.title,
      thankYouData.message,
      thankYouData.allow_social,
      thankYouData.redirect_url,
      thankYouData.reward_video,
    ];
    
    await client.query(thankYouInsertQuery, thankYouValues);

    // Step 3: Insert into the extra_settings table
    const extraSettingsInsertQuery = `
      INSERT INTO extra_settings (
        space_id,
        max_duration,
        max_char,
        video_btn_text,
        text_btn_text,
        consent_display,
        consent_statement,
        text_submission_title,
        questions_label,
        default_text_testimonial_avatar,
        affiliate_link,
        third_party,
        auto_populate_testimonials_to_the_wall_of_love,
        disable_video_recording_for_iphone_users,
        allow_search_engines_to_index_your_page
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
    `;
    
    const extraSettingsValues = [
      spaceId, // Use the generated space ID
      extraSettingsData.max_duration,
      extraSettingsData.max_char,
      extraSettingsData.video_btn_text,
      extraSettingsData.text_btn_text,
      extraSettingsData.consent_display,
      extraSettingsData.consent_statement,
      extraSettingsData.text_submission_title,
      extraSettingsData.questions_label,
      extraSettingsData.default_text_testimonial_avatar,
      extraSettingsData.affiliate_link,
      JSON.stringify(extraSettingsData.third_party),
      extraSettingsData.auto_populate_testimonials_to_the_wall_of_love,
      extraSettingsData.disable_video_recording_for_iphone_users,
      extraSettingsData.allow_search_engines_to_index_your_page,
    ];

    await client.query(extraSettingsInsertQuery, extraSettingsValues);
    
    // Commit the transaction if all inserts are successful
    await client.query("COMMIT");
    console.log("All data inserted successfully.");
  } catch (err) {
    await client.query("ROLLBACK"); // Rollback in case of error
    console.error("Error inserting data: ", err);
  } finally {
    client.release(); // Release the client back to the pool
  }
};
