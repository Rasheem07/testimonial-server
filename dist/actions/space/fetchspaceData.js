"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTestimonialspaceData = void 0;
const db_1 = require("../../lib/db");
const redis_1 = require("../../lib/redis");
const fetchTestimonialspaceData = (space_name) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        // Check Redis cache first
        const cachedData = yield redis_1.redisClient.get(space_name);
        if (cachedData) {
            console.log("Cache hit: Returning data from Redis");
            return JSON.parse(cachedData); // Return cached data
        }
        // Join spaces, thank_page, and extra_settings tables
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
        extra_settings.allow_search_engines_to_index_your_page
      FROM 
        spaces
      LEFT JOIN 
        thank_page ON spaces.id = thank_page.space_id
      LEFT JOIN 
        extra_settings ON spaces.id = extra_settings.space_id
      LEFT JOIN 
        (
          SELECT spacename, ARRAY_AGG(content) AS texts  -- Changed testimonial_text to content to match your schema
          FROM text_testimonials
          GROUP BY spacename
        ) text_testimonials ON spaces.space_name = text_testimonials.spacename  -- Subquery for text testimonials
      LEFT JOIN 
        (
          SELECT spacename, ARRAY_AGG(video_url) AS videos
          FROM video_testimonials
          GROUP BY spacename
        ) video_testimonials ON spaces.space_name = video_testimonials.spacename  -- Subquery for video testimonials
      WHERE 
         spaces.space_name = $1;
    `;
        // Execute the query
        const result = yield client.query(query, [space_name]);
        // Check if any data was returned
        if (result.rows.length === 0) {
            return null;
        }
        // Store the result in Redis cache with an expiration time (e.g., 60 minutes)
        yield redis_1.redisClient.set(space_name, JSON.stringify(result.rows[0]));
        return result.rows[0]; // Return the single row with joined data
    }
    catch (err) {
        console.error("Error fetching joined data: ", err);
        throw new Error("Failed to fetch testimonial space data.");
    }
    finally {
        client.release();
    }
});
exports.fetchTestimonialspaceData = fetchTestimonialspaceData;
