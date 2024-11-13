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
exports.createSpaceSchema = void 0;
const shema_1 = require("../utils/shema");
// Define the schema for the space table
const testimonialspaceSchema = `
   CREATE TABLE IF NOT EXISTS spaces (
     id SERIAL PRIMARY KEY,
     user_id SERIAL NOT NULL REFERENCES users(id), 
     space_name VARCHAR(255) UNIQUE NOT NULL,
     logo VARCHAR(5000) NOT NULL,
     header_title VARCHAR(255) NOT NULL,
     custom_message VARCHAR(255) NOT NULL,
     questions JSONB NOT NULL, 
     collect_extra JSONB,    
     collection_type VARCHAR DEFAULT 'text and video',
     collect_star_ratings BOOL DEFAULT false,
     allow_custom_btn_color BOOL DEFAULT false,
     custom_btn_color VARCHAR(8),
     language VARCHAR(255) DEFAULT 'english', 
     video_credits INT CHECK (video_credits BETWEEN 1 AND 10),
     text_credits INT CHECK (text_credits BETWEEN 1 AND 5)
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
const createSpaceSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, shema_1.createSchema)(testimonialspaceSchema);
    yield (0, shema_1.createSchema)(thank_page_info);
    yield (0, shema_1.createSchema)(extra_settingsSchema);
});
exports.createSpaceSchema = createSpaceSchema;
