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
exports.insertSocialTestimonial = exports.insertVideoTestimonial = exports.insertTextTestimonial = void 0;
const db_1 = require("../../lib/db");
const redis_1 = require("../../lib/redis");
const imageUploader_1 = require("../../uploads/imageUploader");
// Helper function to handle image uploads
const uploadImageFiles = (image_src_param, user_photo_param) => __awaiter(void 0, void 0, void 0, function* () {
    if (image_src_param != typeof String && user_photo_param != typeof String) {
        const [image_src, user_photo] = yield Promise.all([
            yield (0, imageUploader_1.uploadImageFile)("text_images", image_src_param),
            yield (0, imageUploader_1.uploadImageFile)("author_photos", user_photo_param),
        ]);
        return [image_src, user_photo];
    }
    else {
        return [image_src_param, user_photo_param]; // Type assertion for string
    }
});
// Insert text testimonial
const insertTextTestimonial = (image_src_param, user_photo_param, data) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const [image_src, user_photo] = yield uploadImageFiles(image_src_param, user_photo_param);
        const query = `
      INSERT INTO text_testimonials (spacename, image_only, image_src, ratings, content, name, user_photo, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *;
    `;
        const values = [
            data.space_name,
            data.image_only,
            image_src,
            data.ratings,
            data.content,
            data.name,
            user_photo,
            data.date,
        ];
        const result = yield client.query(query, values);
        const newTestimonial = result.rows[0];
        // Fetch and update the cache
        const cachedData = yield redis_1.redisClient.get(`${data.space_name}/testimonials`);
        if (cachedData) {
            const testimonials = JSON.parse(cachedData);
            // Add the new testimonial and sort by date
            testimonials.push({
                name: newTestimonial.name,
                date: newTestimonial.date,
                ratings: newTestimonial.ratings,
                content: newTestimonial.content,
                is_liked: newTestimonial.is_liked,
                video_url: null,
                spacename: newTestimonial.spacename,
                type: "text"
            });
            yield redis_1.redisClient.setEx(`${data.space_name}/testimonials`, 3600, JSON.stringify(testimonials));
        }
        return newTestimonial;
    }
    catch (err) {
        console.error("Error inserting text testimonial: ", err);
        throw new Error("Failed to insert text testimonial."); // Keep this concise
    }
    finally {
        client.release(); // Ensure the client is released
    }
});
exports.insertTextTestimonial = insertTextTestimonial;
// Insert video testimonial
const insertVideoTestimonial = (video, data) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const url = yield (0, imageUploader_1.uploadImageFile)("video_testimonials", video);
        if (!url) {
            console.log("error uploading video file");
        }
        const query = `
      INSERT INTO video_testimonials (spacename, video_url, duration, name, ratings)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [
            data.space_name,
            url,
            data.duration,
            data.name,
            data.ratings,
        ];
        const result = yield client.query(query, values);
        return result.rows[0]; // Return the inserted row
    }
    catch (err) {
        console.error("Error inserting video testimonial: ", err);
        throw new Error("Failed to insert video testimonial.");
    }
    finally {
        client.release();
    }
});
exports.insertVideoTestimonial = insertVideoTestimonial;
// Insert social testimonial
const insertSocialTestimonial = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const query = `
      INSERT INTO social_testimonials (socialId, username, content, social_provider, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [
            data.socialId,
            data.username,
            data.content,
            data.social_provider,
            data.date,
        ];
        const result = yield client.query(query, values);
        return result.rows[0]; // Return the inserted row
    }
    catch (err) {
        console.error("Error inserting social testimonial: ", err);
        throw new Error("Failed to insert social testimonial.");
    }
    finally {
        client.release();
    }
});
exports.insertSocialTestimonial = insertSocialTestimonial;
