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
exports.createSocialTestimonial = exports.createVideoTestimonial = exports.handlecreateTestimonial = void 0;
const insertTestimonial_1 = require("../../actions/testimonial/insertTestimonial");
// Insert a new text testimonial
const handlecreateTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const data = req.body; // Assuming the request body contains the testimonial data
        console.log('testimonial data:', data);
        //@ts-ignore
        const image_src = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image_src[0];
        //@ts-ignore
        const user_photo = (_b = req.files) === null || _b === void 0 ? void 0 : _b.user_photo[0];
        yield (0, insertTestimonial_1.insertTextTestimonial)(image_src, user_photo, data);
        return res.status(201).json({
            message: "Testimonial created successfully"
        });
    }
    catch (err) {
        console.error("Error creating testimonial: ", err);
        return res.status(500).json({ message: "Failed to create testimonial." });
    }
});
exports.handlecreateTestimonial = handlecreateTestimonial;
// Insert a new video testimonial
const createVideoTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body; // Assuming the request body contains the video testimonial data
        const video = req.file;
        if (data.duration > 120) {
            return res.status(404).json({ message: "video must be less than 2 minutes!" });
        }
        console.log('video: ', video);
        yield (0, insertTestimonial_1.insertVideoTestimonial)(video, data);
        return res.status(201).json({
            message: "Video testimonial created successfully",
        });
    }
    catch (err) {
        console.error("Error creating video testimonial: ", err);
        return res
            .status(500)
            .json({ message: "Failed to create video testimonial." });
    }
});
exports.createVideoTestimonial = createVideoTestimonial;
// Insert a new social testimonial
const createSocialTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body; // Assuming the request body contains the social testimonial data
        const testimonial = yield (0, insertTestimonial_1.insertSocialTestimonial)(data);
        return res.status(201).json({
            message: "Social testimonial created successfully",
            testimonial,
        });
    }
    catch (err) {
        console.error("Error creating social testimonial: ", err);
        return res
            .status(500)
            .json({ message: "Failed to create social testimonial." });
    }
});
exports.createSocialTestimonial = createSocialTestimonial;
