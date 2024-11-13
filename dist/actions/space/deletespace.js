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
exports.deleteTestimonialspaceData = void 0;
const db_1 = require("../../lib/db");
const deleteTestimonialspaceData = (userId, spaceId) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.PostgresClient.connect();
    try {
        // Start a transaction
        yield client.query("BEGIN");
        // Delete from extra_settings table
        yield client.query("DELETE FROM extra_settings WHERE space_id = $1", [spaceId]);
        // Delete from thank_page table
        yield client.query("DELETE FROM thank_page WHERE space_id = $1", [spaceId]);
        // Delete from spaces table, verifying the user_id
        const result = yield client.query("DELETE FROM spaces WHERE id = $1 AND user_id = $2", [spaceId, userId]);
        if (result.rowCount === 0) {
            throw new Error("Testimonial space not found or unauthorized action.");
        }
        // Commit the transaction if all deletes are successful
        yield client.query("COMMIT");
        console.log("Testimonial space deleted successfully.");
    }
    catch (err) {
        yield client.query("ROLLBACK"); // Rollback if there's an error
        console.error("Error deleting data: ", err);
        throw new Error("Failed to delete testimonial space.");
    }
    finally {
        client.release(); // Release the client
    }
});
exports.deleteTestimonialspaceData = deleteTestimonialspaceData;
