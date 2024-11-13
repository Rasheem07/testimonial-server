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
exports.updateTestimonialspaceData = void 0;
const db_1 = require("../../lib/db");
const updateTestimonialspaceData = (userId, spaceId, spaceData, thankYouData, extraSettingsData) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        // Start transaction
        yield client.query("BEGIN");
        // Update spaces table
        const spaceUpdateQuery = `
      UPDATE spaces
      SET 
        space_name = $1,
        logo = $2,
        header_title = $3,
        custom_message = $4,
        questions = $5,
        collect_extra = $6,
        collection_type = $7,
        collect_star_ratings = $8,
        allow_custom_btn_color = $9,
        custom_btn_color = $10,
        language = $11
      WHERE id = $12 AND user_id = $13;
    `;
        const spaceValues = [
            spaceData.space_name,
            spaceData.logo,
            spaceData.header_title,
            spaceData.custom_message,
            JSON.stringify(spaceData.questions),
            JSON.stringify(spaceData.collect_extra),
            spaceData.collection_type,
            spaceData.collect_star_ratings,
            spaceData.allow_custom_btn_color,
            spaceData.custom_btn_color,
            spaceData.language,
            spaceId,
            userId,
        ];
        yield client.query(spaceUpdateQuery, spaceValues);
        // Update thank_page table
        const thankYouUpdateQuery = `
      UPDATE thank_page
      SET 
        image = $1,
        title = $2,
        message = $3,
        allow_social = $4,
        redirect_url = $5,
        reward_video = $6
      WHERE space_id = $7;
    `;
        const thankYouValues = [
            thankYouData.image,
            thankYouData.title,
            thankYouData.message,
            thankYouData.allow_social,
            thankYouData.redirect_url,
            thankYouData.reward_video,
            spaceId,
        ];
        yield client.query(thankYouUpdateQuery, thankYouValues);
        // Update extra_settings table
        const extraSettingsUpdateQuery = `
      UPDATE extra_settings
      SET 
        max_duration = $1,
        max_char = $2,
        video_btn_text = $3,
        text_btn_text = $4,
        consent_display = $5,
        consent_statement = $6,
        text_submission_title = $7,
        questions_label = $8,
        default_text_testimonial_avatar = $9,
        affiliate_link = $10,
        third_party = $11,
        auto_populate_testimonials_to_the_wall_of_love = $12,
        disable_video_recording_for_iphone_users = $13,
        allow_search_engines_to_index_your_page = $14
      WHERE space_id = $15;
    `;
        const extraSettingsValues = [
            extraSettingsData.max_duration,
            extraSettingsData.max_char,
            extraSettingsData.video_btn_text,
            extraSettingsData.text_btn_text,
            extraSettingsData.consent_display,
            extraSettingsData.consent_statement,
            extraSettingsData.text_submission_title,
            extraSettingsData.questions_label,
            extraSettingsData.default_text_testimonial_avatar,
            extraSettingsData.affiliate_link,
            JSON.stringify(extraSettingsData.third_party),
            extraSettingsData.auto_populate_testimonials_to_the_wall_of_love,
            extraSettingsData.disable_video_recording_for_iphone_users,
            extraSettingsData.allow_search_engines_to_index_your_page,
            spaceId,
        ];
        yield client.query(extraSettingsUpdateQuery, extraSettingsValues);
        // Commit the transaction
        yield client.query("COMMIT");
        console.log("Data updated successfully.");
    }
    catch (err) {
        yield client.query("ROLLBACK");
        console.error("Error updating data: ", err);
        throw new Error("Failed to update testimonial space data.");
    }
    finally {
        client.release();
    }
});
exports.updateTestimonialspaceData = updateTestimonialspaceData;
