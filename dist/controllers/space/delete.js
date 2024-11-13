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
exports.handleDeleteTestimonialspace = handleDeleteTestimonialspace;
const deletespace_1 = require("../../actions/space/deletespace"); // Import the action to delete data
function handleDeleteTestimonialspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Get the user ID from the authenticated request
        const spaceId = req.params.spaceId; // Get the space ID from the URL parameters
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized. User not found." }); // Handle unauthorized access
        }
        try {
            // Call the action to delete the testimonial space data
            yield (0, deletespace_1.deleteTestimonialspaceData)(userId, spaceId);
            res.json({ message: "Testimonial space deleted successfully!" }); // Success response
        }
        catch (error) {
            console.error("Error deleting testimonial space: ", error);
            res.status(500).json({ error: error.message }); // Error response
        }
    });
}
