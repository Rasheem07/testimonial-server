"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = require("../middlewares/authenticateToken");
const add_1 = require("../controllers/testimonial/add"); // Adjust import as necessary
const bodyvalidate_1 = require("../middlewares/bodyvalidate");
const testimonialvalidator_1 = require("../validators/testimonialvalidator");
const delete_1 = require("../controllers/testimonial/delete");
const update_1 = require("../controllers/testimonial/update");
const deletetestimonial_1 = require("../actions/testimonial/deletetestimonial");
const fetch_1 = require("../controllers/testimonial/fetch");
const multer_1 = __importDefault(require("../lib/multer"));
const refreshToken_1 = require("../middlewares/refreshToken");
const like_1 = require("../controllers/testimonial/like");
const testiomonialrouter = express_1.default.Router();
// GET Testimonials
testiomonialrouter.get("/text/:name", refreshToken_1.refreshToken, fetch_1.getTestimonial // Controller to handle fetching text testimonials
);
testiomonialrouter.get("/video/:name", refreshToken_1.refreshToken, fetch_1.handleGetVideoTestimonial // Controller to handle fetching video testimonials
);
testiomonialrouter.get("/:name", fetch_1.getAllTestimonial // Controller to handle fetching video testimonials
);
testiomonialrouter.get("/social/:id", // Get social testimonial by ID
refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, fetch_1.getSocialTestimonial // Controller to handle fetching social testimonials
);
// DELETE Testimonials
testiomonialrouter.delete("/text/:id", // Delete text testimonial by ID
refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, delete_1.deleteTestimonial // Controller to handle deleting text testimonials
);
testiomonialrouter.delete("/video/:id", // Delete video testimonial by ID
refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, deletetestimonial_1.deleteVideoTestimonial // Controller to handle deleting video testimonials
);
testiomonialrouter.delete("/social/:id", // Delete social testimonial by ID
refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, delete_1.handledeleteSocialTestimonial // Controller to handle deleting social testimonials
);
// Text Testimonials
testiomonialrouter.post("/text/add", refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, multer_1.default.fields([{ name: "image_src", maxCount: 1 }, { name: "user_photo", maxCount: 1 }]), (0, bodyvalidate_1.validateRequest)(testimonialvalidator_1.textTestimonialSchema), add_1.handlecreateTestimonial // Handles creation of text testimonial
);
testiomonialrouter.put("/text/update/:id", // Use ID in URL for update
refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, (0, bodyvalidate_1.validateRequest)(testimonialvalidator_1.textTestimonialSchema), update_1.handleupdateTestimonial // Handles update of text testimonial
);
testiomonialrouter.put("/text/delete/:id", // Use ID in URL for update
refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, (0, bodyvalidate_1.validateRequest)(testimonialvalidator_1.textTestimonialSchema), delete_1.deleteTestimonial // Handles update of text testimonial
);
// Video Testimonials
testiomonialrouter.post("/video/add", refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, multer_1.default.single('video'), (0, bodyvalidate_1.validateRequest)(testimonialvalidator_1.videoTestimonialSchema), add_1.createVideoTestimonial // Handles creation of video testimonial
);
testiomonialrouter.put("/video/update/:id", // Use ID in URL for update
refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, (0, bodyvalidate_1.validateRequest)(testimonialvalidator_1.videoTestimonialSchema), update_1.handleupdateVideoTestimonial // Handles update of video testimonial
);
// Social Testimonials
testiomonialrouter.post("/social/add", refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, (0, bodyvalidate_1.validateRequest)(testimonialvalidator_1.socialTestimonialSchema), add_1.createSocialTestimonial // Handles creation of social testimonial
);
testiomonialrouter.put("/social/update/:id", // Use ID in URL for update
refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, (0, bodyvalidate_1.validateRequest)(testimonialvalidator_1.socialTestimonialSchema), update_1.handleupdateSocialTestimonial // Handles update of social testimonial
);
testiomonialrouter.get("/liked/:space_name", like_1.GetAllLikedtestimonials);
testiomonialrouter.put("/:id/togglelike", refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, like_1.HandleToggleLike);
module.exports = testiomonialrouter;
