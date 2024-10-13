import { PostgresClient } from "../config/db";
import { createSchema } from "../utils/shema";

// Define the schema for the space table
const testimonialspaceSchema = `
   CREATE TABLE IF NOT EXISTS spaces (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) UNIQUE NOT NULL,
     logo VARCHAR(255) NOT NULL,
     header_title VARCHAR(255) NOT NULL,
     custom_message VARCHAR(255) NOT NULL,
     questions JSONB NOT NULL, 
     collect_extra JSONB,    
     collection_type VARCHAR DEFAULT 'text and video',
     collect_star_ratings BOOL DEFAULT false,
     allow_custom_btn_color BOOL DEFAULT false,
     custom_btn_color VARCHAR(8),
     language VARCHAR(255) DEFAULT 'english'
   );
`;

const thank_page_info = `
CREATE TABLE IF NOT EXISTS thank_page (
    id SERIAL PRIMARY KEY,
    space_id INTEGER REFERENCES spaces(id),
    image VARCHAR DEFAULT '/gifs/thankyou.gif',
    title VARCHAR DEFAULT 'THANK YOU!',
    message VARCHAR DEFAULT 'Thank you so much for your shoutout! It means a ton for us! 🙏',
    allow_social BOOL DEFAULT false,
    redirect_url VARCHAR,
    reward_video BOOL DEFAULT false
);
`;

const extra_settingsSchema = `
CREATE TABLE IF NOT EXISTS extra_settings (
    id SERIAL PRIMARY KEY,
    space_id INTEGER REFERENCES spaces(id),
    max_duration INTEGER DEFAULT 120,
    max_char INTEGER DEFAULT 0,
    video_btn_text VARCHAR DEFAULT 'Record a video',
    text_btn_text VARCHAR DEFAULT 'Send in text',
    consent_display VARCHAR DEFAULT 'required',
    consent_statement VARCHAR DEFAULT 'I give permission to use this testimonial',
    text_submission_title VARCHAR DEFAULT 'Title',
    questions_label VARCHAR DEFAULT 'Questions',
    default_text_testimonial_avatar VARCHAR,
    affiliate_link VARCHAR,
    third_party JSONB,
    auto_populate_testimonials_to_the_wall_of_love BOOL,
    disable_video_recording_for_iphone_users BOOL,
    allow_search_engines_to_index_your_page BOOL
);
`;


export const createSpaceSchema = async () => {
  await createSchema(testimonialspaceSchema);
  await createSchema(thank_page_info);
  await createSchema(extra_settingsSchema);
};
