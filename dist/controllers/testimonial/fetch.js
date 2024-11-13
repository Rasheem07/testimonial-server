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
exports.getSocialTestimonial = exports.handleGetVideoTestimonial = exports.getAllTestimonial = exports.getTestimonial = void 0;
const fetchtestimonial_1 = require("../../actions/testimonial/fetchtestimonial");
// Fetch a text testimonial by ID
const getTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params; // Get the testimonial ID from request parameters
        const testimonial = yield (0, fetchtestimonial_1.fetchAllTextTestimonials)(name);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found." });
        }
        return res.status(200).json(testimonial);
    }
    catch (err) {
        console.error("Error fetching testimonial: ", err);
        return res.status(500).json({ message: "Failed to fetch testimonial." });
    }
});
exports.getTestimonial = getTestimonial;
const getAllTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params; // Get the testimonial ID from request parameters
        const testimonial = yield (0, fetchtestimonial_1.fetchAllTestimonials)(name);
        if (!testimonial) {
            res.status(404).json({ message: "Testimonials not found." });
            return [];
        }
        return res.status(200).json(testimonial);
    }
    catch (err) {
        console.error("Error fetching testimonial: ", err);
        return res.status(500).json({ message: "Failed to fetch testimonial." });
    }
});
exports.getAllTestimonial = getAllTestimonial;
// Fetch a video testimonial by ID
const handleGetVideoTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params; // Get the testimonial ID from request parameters
        const testimonial = yield (0, fetchtestimonial_1.fetchAllVideoTestimonials)(name);
        if (!testimonial) {
            return res.status(404).json({ message: "Video testimonial not found." });
        }
        return res.status(200).json(testimonial);
    }
    catch (err) {
        console.error("Error fetching video testimonial: ", err);
        return res.status(500).json({ message: "Failed to fetch video testimonial." });
    }
});
exports.handleGetVideoTestimonial = handleGetVideoTestimonial;
// Fetch a social testimonial by ID
const getSocialTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the testimonial ID from request parameters
        const testimonial = yield (0, fetchtestimonial_1.fetchAllSocialTestimonials)(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Social testimonial not found." });
        }
        return res.status(200).json(testimonial);
    }
    catch (err) {
        console.error("Error fetching social testimonial: ", err);
        return res.status(500).json({ message: "Failed to fetch social testimonial." });
    }
});
exports.getSocialTestimonial = getSocialTestimonial;
