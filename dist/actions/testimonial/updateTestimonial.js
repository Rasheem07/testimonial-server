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
exports.updateSocialTestimonial = exports.updateVideoTestimonial = exports.updateTextTestimonial = void 0;
const db_1 = require("../../lib/db");
// Update text testimonial
const updateTextTestimonial = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const query = `
        UPDATE text_testimonials 
        SET 
          image_only = $1,
          image_src = $2,
          ratings = $3,
          content = $4,
          name = $5,
          user_photo = $6,
          is_liked = $7,
          is_archived = $8,
          date = $9
        WHERE id = $10
        RETURNING *;
      `;
        const values = [
            data.image_only, data.image_src, data.ratings,
            data.content, data.name, data.user_photo,
            data.is_liked, data.is_archived, data.date,
            id,
        ];
        const result = yield client.query(query, values);
        if (result.rows.length === 0) {
            throw new Error("Testimonial not found.");
        }
        return result.rows[0]; // Return the updated row
    }
    catch (err) {
        console.error("Error updating text testimonial: ", err);
        throw new Error("Failed to update text testimonial.");
    }
    finally {
        client.release();
    }
});
exports.updateTextTestimonial = updateTextTestimonial;
// Update video testimonial
const updateVideoTestimonial = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const query = `
        UPDATE video_testimonials 
        SET 
          video_url = $1,
          thumbnail_url = $2,
          duration = $3,
          is_liked = $4,
          is_archived = $5,
          name = $6,
          ratings = $7,
          date = $8
        WHERE id = $9
        RETURNING *;
      `;
        const values = [
            data.video_url, data.thumbnail_url, data.duration,
            data.is_liked, data.is_archived, data.name,
            data.ratings, data.date, id,
        ];
        const result = yield client.query(query, values);
        if (result.rows.length === 0) {
            throw new Error("Testimonial not found.");
        }
        return result.rows[0]; // Return the updated row
    }
    catch (err) {
        console.error("Error updating video testimonial: ", err);
        throw new Error("Failed to update video testimonial.");
    }
    finally {
        client.release();
    }
});
exports.updateVideoTestimonial = updateVideoTestimonial;
// Update social testimonial 
const updateSocialTestimonial = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const query = `
        UPDATE social_testimonials 
        SET 
          socialId = $1,
          username = $2,
          content = $3,
          social_provider = $4,
          date = $5
        WHERE id = $6
        RETURNING *;
      `;
        const values = [
            data.socialId, data.username, data.content,
            data.social_provider, data.date, id,
        ];
        const result = yield client.query(query, values);
        if (result.rows.length === 0) {
            throw new Error("Testimonial not found.");
        }
        return result.rows[0]; // Return the updated row
    }
    catch (err) {
        console.error("Error updating social testimonial: ", err);
        throw new Error("Failed to update social testimonial.");
    }
    finally {
        client.release();
    }
});
exports.updateSocialTestimonial = updateSocialTestimonial;
