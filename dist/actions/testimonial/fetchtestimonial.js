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
exports.fetchAllSocialTestimonials = exports.fetchAllTestimonials = exports.fetchAllVideoTestimonials = exports.fetchAllTextTestimonials = void 0;
const db_1 = require("../../lib/db");
const redis_1 = require("../../lib/redis");
// Fetch all text testimonials
const fetchAllTextTestimonials = (space_name) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const query = `SELECT *, 'text' AS type FROM text_testimonials where spacename = $1;`;
        const result = yield client.query(query, [space_name]);
        return result.rows; // Return all text testimonials
    }
    catch (err) {
        console.error("Error fetching text testimonials: ", err);
        throw new Error("Failed to fetch text testimonials.");
    }
    finally {
        client.release();
    }
});
exports.fetchAllTextTestimonials = fetchAllTextTestimonials;
// Fetch all video testimonials
const fetchAllVideoTestimonials = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const query = `SELECT *, 'video' AS type FROM video_testimonials where spacename = $1`;
        const result = yield client.query(query, [name]);
        return result.rows; // Return all video testimonials
    }
    catch (err) {
        console.error("Error fetching video testimonials: ", err);
        throw new Error("Failed to fetch video testimonials.");
    }
    finally {
        client.release();
    }
});
exports.fetchAllVideoTestimonials = fetchAllVideoTestimonials;
// Fetch all testimonials
const fetchAllTestimonials = (space_name) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    const cachedData = yield redis_1.redisClient.get(`${space_name}/testimonials`);
    if (cachedData) {
        console.log("Cache hit: Returning data from Redis");
        return JSON.parse(cachedData); // Return cached data
    }
    try {
        const query = `
      SELECT 
        id,
        name, 
        date, 
        ratings, 
        content, 
        is_liked,
        NULL AS video_url,
        spacename,
        'text' AS type
      FROM text_testimonials 
      WHERE spacename = $1

      UNION ALL

      SELECT 
        id,
        name, 
        date, 
        ratings, 
        NULL AS content, 
        is_liked,
        video_url,
        spacename,
        'video' AS type
      FROM video_testimonials 
      WHERE spacename = $1
      
      ORDER BY date; -- Order all testimonials by date
    `;
        const result = yield client.query(query, [space_name]);
        yield redis_1.redisClient.setEx(`${space_name}/testimonials`, 3600, JSON.stringify(result.rows));
        return result.rows; // Return all testimonials, with type included and ordered by date
    }
    catch (err) {
        console.error("Error fetching testimonials: ", err);
        throw new Error("Failed to fetch testimonials.");
    }
    finally {
        client.release();
    }
});
exports.fetchAllTestimonials = fetchAllTestimonials;
// Fetch all social testimonials
const fetchAllSocialTestimonials = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        const query = `SELECT * FROM social_testimonials where space_id = $1`;
        const result = yield client.query(query, [id]);
        return result.rows; // Return all social testimonials
    }
    catch (err) {
        console.error("Error fetching social testimonials: ", err);
        throw new Error("Failed to fetch social testimonials.");
    }
    finally {
        client.release();
    }
});
exports.fetchAllSocialTestimonials = fetchAllSocialTestimonials;
