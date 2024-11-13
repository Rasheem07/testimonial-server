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
exports.handleUpdateTestimonialspace = handleUpdateTestimonialspace;
const updatespaceData_1 = require("../../actions/space/updatespaceData");
function handleUpdateTestimonialspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const spaceId = req.params.spaceId;
        // Extract fields to update from the request body
        const spaceData = req.body.spaceData;
        const thankYouData = req.body.thankYouData;
        const extraSettingsData = req.body.extraSettingsData;
        if (req.space == 1) {
            res.json({ type: "error", error: "space does not exists!" });
        }
        try {
            // Call the update action
            yield (0, updatespaceData_1.updateTestimonialspaceData)(userId, spaceId, spaceData, thankYouData, extraSettingsData);
            res.json({ message: "Testimonial space updated successfully!" });
        }
        catch (error) {
            console.error("Error updating testimonial space: ", error);
            res.status(500).json({ error: error.message });
        }
    });
}
