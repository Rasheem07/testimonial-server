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
exports.HandleToggleLike = exports.GetAllLikedtestimonials = void 0;
const db_1 = require("../../lib/db");
const redis_1 = require("../../lib/redis");
const GetAllLikedtestimonials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { space_name } = req.params;
    const client = yield db_1.PostgresClient.connect();
    try {
        const cachedData = yield redis_1.redisClient.get(`${space_name}/testimonials`);
        if (cachedData) {
            console.log("Cache hit: Returning data from Redis");
            const parsedData = yield JSON.parse(cachedData); // Return cached data
            const likedTestimonials = parsedData.filter((testimonial) => testimonial.is_liked);
            return res.json(likedTestimonials);
        }
        const likedTestimonials = yield client.query(`
      SELECT 
        name, 
        date, 
        ratings, 
        content, 
        NULL AS video_url,
        spacename,
        'text' AS type
      FROM text_testimonials 
      WHERE spacename = $1 AND is_liked = TRUE

      UNION ALL

      SELECT 
        name, 
        date, 
        ratings, 
        NULL AS content, 
        video_url,
        spacename,
        'video' AS type
      FROM video_testimonials 
      WHERE spacename = $1 AND is_liked = TRUE
      
      ORDER BY date; -- Order all testimonials by date
    `, [space_name]);
        res.json(likedTestimonials.rows);
    }
    catch (error) {
        res.status(500).json({ error: error === null || error === void 0 ? void 0 : error.message });
    }
    finally {
        client.release();
    }
});
exports.GetAllLikedtestimonials = GetAllLikedtestimonials;
const HandleToggleLike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }
    const client = yield db_1.PostgresClient.connect();
    try {
        yield client.query('BEGIN');
        // Query to check the existence of the testimonial in both tables
        const checkResult = yield client.query(`
      SELECT 
        'text' AS type, spacename, is_liked FROM text_testimonials WHERE id = $1
      UNION ALL
      SELECT 
        'video' AS type, spacename, is_liked FROM video_testimonials WHERE id = $1;
      `, [id]);
        if (checkResult.rowCount === 0) {
            // If the testimonial is not found in either table, rollback and send a 404
            yield client.query('ROLLBACK');
            return res.status(404).json({ error: 'Testimonial not found' });
        }
        const testimonial = checkResult.rows[0];
        let toggleResult;
        if (testimonial.type === 'text') {
            // Toggle is_liked in the text_testimonials table
            toggleResult = yield client.query(`
        UPDATE text_testimonials 
        SET is_liked = NOT is_liked
        WHERE id = $1
        RETURNING is_liked;
        `, [id]);
        }
        else {
            // Toggle is_liked in the video_testimonials table
            toggleResult = yield client.query(`
        UPDATE video_testimonials 
        SET is_liked = NOT is_liked
        WHERE id = $1
        RETURNING is_liked;
        `, [id]);
        }
        // Fetch the cached data from Redis
        const cachedData = yield redis_1.redisClient.get(`${testimonial.spacename}/testimonials`);
        if (cachedData) {
            console.log("Cache hit: Returning data from Redis");
            // Parse the cached data
            const parsedData = JSON.parse(cachedData);
            // Update the testimonial in the cache
            const updatedData = parsedData.map((item) => {
                // If the item ID matches, update the is_liked status
                if (item.id === id) {
                    item.is_liked = toggleResult.rows[0].is_liked;
                }
                return item;
            });
            // Save the updated data back to Redis
            yield redis_1.redisClient.set(`${testimonial.spacename}/testimonials`, JSON.stringify(updatedData));
        }
        // Commit the transaction
        yield client.query('COMMIT');
        // Return the response with the new like status
        return res.json({ is_liked: toggleResult.rows[0].is_liked });
    }
    catch (error) {
        // Rollback in case of any error
        yield client.query('ROLLBACK');
        return res.status(500).json({ error: error.message });
    }
    finally {
        // Release the client
        client.release();
    }
});
exports.HandleToggleLike = HandleToggleLike;
