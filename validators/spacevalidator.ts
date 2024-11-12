import Joi from 'joi';

// Define validation for `spaces` schema
const spacesSchema = Joi.object({ 
  space_name: Joi.string().max(255).required(),
  header_title: Joi.string().max(255).required(),
  custom_message: Joi.string().max(255).required(),
  questions: Joi.array().items(Joi.object()).required(),
  collect_extra: Joi.object(),
  collection_type: Joi.string().valid('text', 'video', 'text and video').default('text and video'),
  collect_star_ratings: Joi.boolean().default(false),
  allow_custom_btn_color: Joi.boolean().default(false),
  custom_btn_color: Joi.string().length(8).optional(), // Assuming hex color code
  language: Joi.string().max(255).default('english'),
  video_credits: Joi.number().integer().min(1).max(10),
  text_credits: Joi.number().integer().min(1).max(5),
});

// Define validation for `thank_page` schema
const thankPageSchema = Joi.object({ 
  image: Joi.string().default('/gifs/thankyou.gif'),
  title: Joi.string().default('THANK YOU!'),
  message: Joi.string().default('Thank you so much for your shoutout! It means a ton for us! 🙏'),
  allow_social: Joi.boolean().default(false),
  redirect_url: Joi.string().uri().optional(),
  reward_video: Joi.boolean().default(false),
}); 

// Define validation for `extra_settings` schema
const extraSettingsSchema = Joi.object({
  max_duration: Joi.number().integer().default(120),
  max_char: Joi.number().integer().default(0),
  video_btn_text: Joi.string().default('Record a video'),
  text_btn_text: Joi.string().default('Send in text'),
  consent_display: Joi.string().valid('required', 'optional').default('required'),
  consent_statement: Joi.string().default('I give permission to use this testimonial'),
  text_submission_title: Joi.string().default('Title'),
  questions_label: Joi.string().default('Questions'),
  default_text_testimonial_avatar: Joi.string().optional(),
  affiliate_link: Joi.string().uri().optional(),
  third_party: Joi.object().optional(),
  auto_populate_testimonials_to_the_wall_of_love: Joi.boolean().default(false),
  disable_video_recording_for_iphone_users: Joi.boolean().default(false),
  allow_search_engines_to_index_your_page: Joi.boolean().default(false),
});

// Combine all schemas into one validation schema
export const combinedspaceSchema = Joi.object({
  spaces: spacesSchema,
  thank_page: thankPageSchema,
  extra_settings: extraSettingsSchema,
  logo: Joi.any()
});

