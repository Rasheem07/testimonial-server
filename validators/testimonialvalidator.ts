import { File } from "buffer";
import Joi from "joi";

// Validation schema for text testimonials
const textTestimonialSchema = Joi.object({
  space_name: Joi.string().required(), // Ensure space_id is present
  image_only: Joi.boolean().default(false),  
  image_src: Joi.alternatives()
    .try( 
      Joi.object(), // Check for File object
      Joi.string() // Check for string
    ) 
    .optional(),
  ratings: Joi.number().integer().min(1).max(5).optional().default(5), // Ratings between 1 and 5
  content: Joi.string().max(300).optional(),
  name: Joi.string().max(255).optional(),
  user_photo: Joi.alternatives()
    .try(
      Joi.object(), // Check for File object
      Joi.string() // Check for string
    )
    .optional(),
  is_liked: Joi.boolean().default(true),
  is_archived: Joi.boolean().default(false),
  date: Joi.date().default(() => new Date()), // Default to current date
}).custom((value, helpers) => {
  // Custom validation to ensure if image_only is true, image_src must be present
  if (value.image_only && !value.image_src) {
    return helpers.error("any.required", {
      message: "image_src is required when image_only is true",
    });
  }
  // Custom validation to ensure if image_only is true, content and name must be present
  if (value.image_only && (!value.content || !value.name)) {
    return helpers.error("any.required", {
      message: "content and name are required when image_only is true",
    });
  }
  return value;
});

// Validation schema for video testimonials
const videoTestimonialSchema = Joi.object({
  space_name: Joi.string().required(), // Ensure space_id is present
  video: Joi.object().messages({
    'object.instance': "video must be of file instance",
    'object.base': "video must be passed"
  }),
  ratings: Joi.number().integer().min(1).max(5).optional().default(5), // Ratings between 1 and 5
  duration: Joi.number()
    .max(120)
    .messages({
      'number.max': 'Duration must be less than 2 minutes.',
      'number.base': 'Duration must be a number.',
      'any.required': 'Duration is required.'
    })
    .required(),// Add this line if you want to make the duration required
  name: Joi.string().max(255).required(),
});

// Validation schema for social testimonials
const socialTestimonialSchema = Joi.object({
  socialId: Joi.string().required(), // Ensure socialId is present
  username: Joi.string().required(),
  content: Joi.string().required(),
  social_provider: Joi.string().required(),
  date: Joi.date().default(() => new Date()), // Default to current date
});

export {
  textTestimonialSchema,
  videoTestimonialSchema,
  socialTestimonialSchema,
};
