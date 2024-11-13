"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.combinedspaceSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Define validation for `spaces` schema
const spacesSchema = joi_1.default.object({
    space_name: joi_1.default.string().max(255).required(),
    header_title: joi_1.default.string().max(255).required(),
    custom_message: joi_1.default.string().max(255).required(),
    questions: joi_1.default.array().items(joi_1.default.object()).required(),
    collect_extra: joi_1.default.object(),
    collection_type: joi_1.default.string().valid('text', 'video', 'text and video').default('text and video'),
    collect_star_ratings: joi_1.default.boolean().default(false),
    allow_custom_btn_color: joi_1.default.boolean().default(false),
    custom_btn_color: joi_1.default.string().length(8).optional(), // Assuming hex color code
    language: joi_1.default.string().max(255).default('english'),
    video_credits: joi_1.default.number().integer().min(1).max(10),
    text_credits: joi_1.default.number().integer().min(1).max(5),
});
// Define validation for `thank_page` schema
const thankPageSchema = joi_1.default.object({
    image: joi_1.default.string().default('/gifs/thankyou.gif'),
    title: joi_1.default.string().default('THANK YOU!'),
    message: joi_1.default.string().default('Thank you so much for your shoutout! It means a ton for us! 🙏'),
    allow_social: joi_1.default.boolean().default(false),
    redirect_url: joi_1.default.string().uri().optional(),
    reward_video: joi_1.default.boolean().default(false),
});
// Define validation for `extra_settings` schema
const extraSettingsSchema = joi_1.default.object({
    max_duration: joi_1.default.number().integer().default(120),
    max_char: joi_1.default.number().integer().default(0),
    video_btn_text: joi_1.default.string().default('Record a video'),
    text_btn_text: joi_1.default.string().default('Send in text'),
    consent_display: joi_1.default.string().valid('required', 'optional').default('required'),
    consent_statement: joi_1.default.string().default('I give permission to use this testimonial'),
    text_submission_title: joi_1.default.string().default('Title'),
    questions_label: joi_1.default.string().default('Questions'),
    default_text_testimonial_avatar: joi_1.default.string().optional(),
    affiliate_link: joi_1.default.string().uri().optional(),
    third_party: joi_1.default.object().optional(),
    auto_populate_testimonials_to_the_wall_of_love: joi_1.default.boolean().default(false),
    disable_video_recording_for_iphone_users: joi_1.default.boolean().default(false),
    allow_search_engines_to_index_your_page: joi_1.default.boolean().default(false),
});
// Combine all schemas into one validation schema
exports.combinedspaceSchema = joi_1.default.object({
    spaces: spacesSchema,
    thank_page: thankPageSchema,
    extra_settings: extraSettingsSchema,
    logo: joi_1.default.any()
});
