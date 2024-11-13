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
exports.insertTestimonialspaceData = void 0;
const db_1 = require("../../lib/db");
const imageUploader_1 = require("../../uploads/imageUploader");
const insertTestimonialspaceData = (userId, file, spaceData, thankYouData, extraSettingsData) => __awaiter(void 0, void 0, void 0, function* () {
    const dbClient = yield db_1.PostgresClient.connect();
    try {
        // Start transaction
        yield dbClient.query("BEGIN");
        // Step 1: Insert into the space table
        const spaceInsertQuery = `
      INSERT INTO spaces (
        user_id,
        space_name,
        logo,
        header_title,
        custom_message,
        questions,
        collect_extra,
        collection_type,
        collect_star_ratings,
        allow_custom_btn_color,
        custom_btn_color,
        language
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      ) RETURNING id;
    `;
        const logoImage = yield (0, imageUploader_1.uploadImageFile)('logos', file);
        const spaceValues = [
            userId,
            spaceData.space_name,
            logoImage,
            spaceData.header_title,
            spaceData.custom_message,
            JSON.stringify(spaceData.questions),
            JSON.stringify(spaceData.collect_extra),
            spaceData.collection_type,
            spaceData.collect_star_ratings,
            spaceData.allow_custom_btn_color,
            spaceData.custom_btn_color,
            spaceData.language,
        ];
        const spaceResult = yield dbClient.query(spaceInsertQuery, spaceValues);
        const spaceId = spaceResult.rows[0].id; // Get the generated space ID
        // Step 2: Insert into the thank_you_page table
        const thankYouInsertQuery = `
      INSERT INTO thank_page (
        space_id,
        image,
        title,
        message,
        allow_social,
        redirect_url,
        reward_video
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
        const thankYouValues = [
            spaceId, // Use the generated space ID
            thankYouData === null || thankYouData === void 0 ? void 0 : thankYouData.image,
            thankYouData === null || thankYouData === void 0 ? void 0 : thankYouData.title,
            thankYouData === null || thankYouData === void 0 ? void 0 : thankYouData.message,
            thankYouData === null || thankYouData === void 0 ? void 0 : thankYouData.allow_social,
            thankYouData === null || thankYouData === void 0 ? void 0 : thankYouData.redirect_url,
            thankYouData === null || thankYouData === void 0 ? void 0 : thankYouData.reward_video,
        ];
        yield dbClient.query(thankYouInsertQuery, thankYouValues);
        // Step 3: Insert into the extra_settings table
        const extraSettingsInsertQuery = `
      INSERT INTO extra_settings (
        space_id,
        max_duration,
        max_char,
        video_btn_text,
        text_btn_text,
        consent_display,
        consent_statement,
        text_submission_title,
        questions_label,
        default_text_testimonial_avatar,
        affiliate_link,
        third_party,
        auto_populate_testimonials_to_the_wall_of_love,
        disable_video_recording_for_iphone_users,
        allow_search_engines_to_index_your_page
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
    `;
        const extraSettingsValues = [
            spaceId, // Use the generated space ID
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.max_duration,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.max_char,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.video_btn_text,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.text_btn_text,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.consent_display,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.consent_statement,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.text_submission_title,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.questions_label,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.default_text_testimonial_avatar,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.affiliate_link,
            JSON.stringify(extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.third_party),
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.auto_populate_testimonials_to_the_wall_of_love,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.disable_video_recording_for_iphone_users,
            extraSettingsData === null || extraSettingsData === void 0 ? void 0 : extraSettingsData.allow_search_engines_to_index_your_page,
        ];
        yield dbClient.query(extraSettingsInsertQuery, extraSettingsValues);
        // Commit the transaction if all inserts are successful
        yield dbClient.query("COMMIT");
        console.log("All data inserted successfully.");
    }
    catch (err) {
        yield dbClient.query("ROLLBACK"); // Rollback in case of error
        console.error("Error inserting data: ", err);
    }
    finally {
        dbClient.release();
        console.log("successfully inserted!");
    }
});
exports.insertTestimonialspaceData = insertTestimonialspaceData;
