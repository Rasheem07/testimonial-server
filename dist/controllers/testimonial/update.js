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
exports.handleupdateSocialTestimonial = exports.handleupdateVideoTestimonial = exports.handleupdateTestimonial = void 0;
const updateTestimonial_1 = require("../../actions/testimonial/updateTestimonial");
// Update an existing text testimonial
const handleupdateTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the testimonial ID from request parameters
        const data = req.body; // Get updated data from request body
        const updatedTestimonial = yield (0, updateTestimonial_1.updateTextTestimonial)(id, data);
        if (!updatedTestimonial) {
            return res.status(404).json({ message: "Testimonial not found." });
        }
        return res.status(200).json({
            message: "Testimonial updated successfully",
            updatedTestimonial,
        });
    }
    catch (err) {
        console.error("Error updating testimonial: ", err);
        return res.status(500).json({ message: "Failed to update testimonial." });
    }
});
exports.handleupdateTestimonial = handleupdateTestimonial;
// Update an existing video testimonial
const handleupdateVideoTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the testimonial ID from request parameters
        const data = req.body; // Get updated data from request body
        const updatedTestimonial = yield (0, updateTestimonial_1.updateVideoTestimonial)(id, data);
        if (!updatedTestimonial) {
            return res.status(404).json({ message: "Video testimonial not found." });
        }
        return res.status(200).json({
            message: "Video testimonial updated successfully",
            updatedTestimonial,
        });
    }
    catch (err) {
        console.error("Error updating video testimonial: ", err);
        return res.status(500).json({ message: "Failed to update video testimonial." });
    }
});
exports.handleupdateVideoTestimonial = handleupdateVideoTestimonial;
// Update an existing social testimonial
const handleupdateSocialTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the testimonial ID from request parameters
        const data = req.body; // Get updated data from request body
        const updatedTestimonial = yield (0, updateTestimonial_1.updateSocialTestimonial)(id, data);
        if (!updatedTestimonial) {
            return res.status(404).json({ message: "Social testimonial not found." });
        }
        return res.status(200).json({
            message: "Social testimonial updated successfully",
            updatedTestimonial,
        });
    }
    catch (err) {
        console.error("Error updating social testimonial: ", err);
        return res.status(500).json({ message: "Failed to update social testimonial." });
    }
});
exports.handleupdateSocialTestimonial = handleupdateSocialTestimonial;
