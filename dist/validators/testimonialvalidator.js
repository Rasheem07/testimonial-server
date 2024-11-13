"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socialTestimonialSchema = exports.videoTestimonialSchema = exports.textTestimonialSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Validation schema for text testimonials
const textTestimonialSchema = joi_1.default.object({
    space_name: joi_1.default.string().required(), // Ensure space_id is present
    image_only: joi_1.default.boolean().default(false),
    image_src: joi_1.default.alternatives()
        .try(joi_1.default.object(), // Check for File object
    joi_1.default.string() // Check for string
    )
        .optional(),
    ratings: joi_1.default.number().integer().min(1).max(5).optional().default(5), // Ratings between 1 and 5
    content: joi_1.default.string().max(300).optional(),
    name: joi_1.default.string().max(255).optional(),
    user_photo: joi_1.default.alternatives()
        .try(joi_1.default.object(), // Check for File object
    joi_1.default.string() // Check for string
    )
        .optional(),
    is_liked: joi_1.default.boolean().default(true),
    is_archived: joi_1.default.boolean().default(false),
    date: joi_1.default.date().default(() => new Date()), // Default to current date
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
exports.textTestimonialSchema = textTestimonialSchema;
// Validation schema for video testimonials
const videoTestimonialSchema = joi_1.default.object({
    space_name: joi_1.default.string().required(), // Ensure space_id is present
    video: joi_1.default.object().messages({
        'object.instance': "video must be of file instance",
        'object.base': "video must be passed"
    }),
    ratings: joi_1.default.number().integer().min(1).max(5).optional().default(5), // Ratings between 1 and 5
    duration: joi_1.default.number()
        .max(120)
        .messages({
        'number.max': 'Duration must be less than 2 minutes.',
        'number.base': 'Duration must be a number.',
        'any.required': 'Duration is required.'
    })
        .required(), // Add this line if you want to make the duration required
    name: joi_1.default.string().max(255).required(),
});
exports.videoTestimonialSchema = videoTestimonialSchema;
// Validation schema for social testimonials
const socialTestimonialSchema = joi_1.default.object({
    socialId: joi_1.default.string().required(), // Ensure socialId is present
    username: joi_1.default.string().required(),
    content: joi_1.default.string().required(),
    social_provider: joi_1.default.string().required(),
    date: joi_1.default.date().default(() => new Date()), // Default to current date
});
exports.socialTestimonialSchema = socialTestimonialSchema;
