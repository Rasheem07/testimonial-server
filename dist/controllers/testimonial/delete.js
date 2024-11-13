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
exports.handledeleteSocialTestimonial = exports.handledeleteVideoTestimonial = exports.deleteTestimonial = void 0;
const deletetestimonial_1 = require("../../actions/testimonial/deletetestimonial");
// Delete a text testimonial
const deleteTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the testimonial ID from request parameters
        const deletedTestimonial = yield (0, deletetestimonial_1.deleteTextTestimonial)(id);
        if (!deletedTestimonial) {
            return res.status(404).json({ message: "Testimonial not found." });
        }
        return res.status(200).json({
            message: "Testimonial deleted successfully",
            deletedTestimonial,
        });
    }
    catch (err) {
        console.error("Error deleting testimonial: ", err);
        return res.status(500).json({ message: "Failed to delete testimonial." });
    }
});
exports.deleteTestimonial = deleteTestimonial;
// Delete a video testimonial
const handledeleteVideoTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the testimonial ID from request parameters
        const deletedTestimonial = yield (0, deletetestimonial_1.deleteVideoTestimonial)(id);
        if (!deletedTestimonial) {
            return res.status(404).json({ message: "Video testimonial not found." });
        }
        return res.status(200).json({
            message: "Video testimonial deleted successfully",
            deletedTestimonial,
        });
    }
    catch (err) {
        console.error("Error deleting video testimonial: ", err);
        return res.status(500).json({ message: "Failed to delete video testimonial." });
    }
});
exports.handledeleteVideoTestimonial = handledeleteVideoTestimonial;
// Delete a social testimonial
const handledeleteSocialTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the testimonial ID from request parameters
        const deletedTestimonial = yield (0, deletetestimonial_1.deleteSocialTestimonial)(id);
        if (!deletedTestimonial) {
            return res.status(404).json({ message: "Social testimonial not found." });
        }
        return res.status(200).json({
            message: "Social testimonial deleted successfully",
            deletedTestimonial,
        });
    }
    catch (err) {
        console.error("Error deleting social testimonial: ", err);
        return res.status(500).json({ message: "Failed to delete social testimonial." });
    }
});
exports.handledeleteSocialTestimonial = handledeleteSocialTestimonial;
