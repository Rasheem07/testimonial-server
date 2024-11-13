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
exports.deleteSocialTestimonial = exports.deleteVideoTestimonial = exports.deleteTextTestimonial = void 0;
const db_1 = require("../../lib/db");
// Delete text testimonial
const deleteTextTestimonial = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const query = `DELETE FROM text_testimonials WHERE id = $1 RETURNING *;`;
        const result = yield client.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error("Testimonial not found.");
        }
        return result.rows[0]; // Return the deleted row
    }
    catch (err) {
        console.error("Error deleting text testimonial: ", err);
        throw new Error("Failed to delete text testimonial.");
    }
    finally {
        client.release();
    }
});
exports.deleteTextTestimonial = deleteTextTestimonial;
// Delete video testimonial
const deleteVideoTestimonial = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const query = `DELETE FROM video_testimonials WHERE id = $1 RETURNING *;`;
        const result = yield client.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error("Testimonial not found.");
        }
        return result.rows[0]; // Return the deleted row
    }
    catch (err) {
        console.error("Error deleting video testimonial: ", err);
        throw new Error("Failed to delete video testimonial.");
    }
    finally {
        client.release();
    }
});
exports.deleteVideoTestimonial = deleteVideoTestimonial;
// Delete social testimonial
const deleteSocialTestimonial = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const query = `DELETE FROM social_testimonials WHERE id = $1 RETURNING *;`;
        const result = yield client.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error("Testimonial not found.");
        }
        return result.rows[0]; // Return the deleted row
    }
    catch (err) {
        console.error("Error deleting social testimonial: ", err);
        throw new Error("Failed to delete social testimonial.");
    }
    finally {
        client.release();
    }
});
exports.deleteSocialTestimonial = deleteSocialTestimonial;
