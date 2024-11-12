import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import {
  createSocialTestimonial,
  createVideoTestimonial,
  handlecreateTestimonial,
} from "../controllers/testimonial/add"; // Adjust import as necessary
import { validateRequest } from "../middlewares/bodyvalidate";
import {
  socialTestimonialSchema,
  textTestimonialSchema,
  videoTestimonialSchema,
} from "../validators/testimonialvalidator";
import {
  deleteTestimonial,
  handledeleteSocialTestimonial,
} from "../controllers/testimonial/delete";
import {
  handleupdateSocialTestimonial,
  handleupdateTestimonial,
  handleupdateVideoTestimonial,
} from "../controllers/testimonial/update";
import { deleteVideoTestimonial } from "../actions/testimonial/deletetestimonial";
import {
  getAllTestimonial,
  getSocialTestimonial,
  getTestimonial,
  handleGetVideoTestimonial,
} from "../controllers/testimonial/fetch";
import upload from "../lib/multer";
import { refreshToken } from "../middlewares/refreshToken";
import { GetAllLikedtestimonials, HandleToggleLike } from "../controllers/testimonial/like";

const testiomonialrouter = express.Router();

// GET Testimonials
testiomonialrouter.get(
  "/text/:name", 
  refreshToken,
  getTestimonial // Controller to handle fetching text testimonials
);

testiomonialrouter.get(
  "/video/:name", 
  refreshToken,
  handleGetVideoTestimonial // Controller to handle fetching video testimonials
);

testiomonialrouter.get(
  "/:name", 
  getAllTestimonial // Controller to handle fetching video testimonials
);

testiomonialrouter.get(
  "/social/:id", // Get social testimonial by ID
  refreshToken,
  authenticateToken,
  getSocialTestimonial // Controller to handle fetching social testimonials
);

// DELETE Testimonials
testiomonialrouter.delete(
  "/text/:id", // Delete text testimonial by ID
  refreshToken,
  authenticateToken,
  deleteTestimonial // Controller to handle deleting text testimonials
);

testiomonialrouter.delete(
  "/video/:id", // Delete video testimonial by ID
  refreshToken,
  authenticateToken,
  deleteVideoTestimonial // Controller to handle deleting video testimonials
);

testiomonialrouter.delete(
  "/social/:id", // Delete social testimonial by ID
  refreshToken,
  authenticateToken,
  handledeleteSocialTestimonial // Controller to handle deleting social testimonials
);

// Text Testimonials
testiomonialrouter.post(
  "/text/add",
  refreshToken,
  authenticateToken,
  upload.fields([{name: "image_src", maxCount: 1}, {name: "user_photo", maxCount: 1}]),
  validateRequest(textTestimonialSchema),
  handlecreateTestimonial // Handles creation of text testimonial
);

testiomonialrouter.put(
  "/text/update/:id", // Use ID in URL for update
  refreshToken,
  authenticateToken,
  validateRequest(textTestimonialSchema),
  handleupdateTestimonial // Handles update of text testimonial
);

testiomonialrouter.put(
  "/text/delete/:id", // Use ID in URL for update
  refreshToken,
  authenticateToken,
  validateRequest(textTestimonialSchema),
  deleteTestimonial // Handles update of text testimonial
);

// Video Testimonials
testiomonialrouter.post(
  "/video/add",
  refreshToken,
  authenticateToken,
  upload.single('video'),
  validateRequest(videoTestimonialSchema),
  createVideoTestimonial // Handles creation of video testimonial
);

testiomonialrouter.put(
  "/video/update/:id", // Use ID in URL for update
  refreshToken,
  authenticateToken,
  validateRequest(videoTestimonialSchema),
  handleupdateVideoTestimonial // Handles update of video testimonial
);

// Social Testimonials
testiomonialrouter.post(
  "/social/add",
  refreshToken,
  authenticateToken,
  validateRequest(socialTestimonialSchema),
  createSocialTestimonial // Handles creation of social testimonial
);

testiomonialrouter.put(
  "/social/update/:id", // Use ID in URL for update
  refreshToken,
  authenticateToken,
  validateRequest(socialTestimonialSchema),
  handleupdateSocialTestimonial // Handles update of social testimonial
);

testiomonialrouter.get(
  "/liked/:space_name",
  GetAllLikedtestimonials
);

testiomonialrouter.put(
  "/:id/togglelike",
  refreshToken,
  authenticateToken,
  HandleToggleLike
);

module.exports = testiomonialrouter;