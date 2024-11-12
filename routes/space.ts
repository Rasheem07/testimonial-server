import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { handleAddTestimonialspace } from "../controllers/space/add";
import { doesSpaceExists } from "../middlewares/isSpaceExist";
import { validateRequest } from "../middlewares/bodyvalidate";
import { combinedspaceSchema } from "../validators/spacevalidator";
import {
  handleFetchAllSpace,
  handleFetchAllTestimonialspace,
  handleFetchTestimonialspace,
} from "../controllers/space/fetch";
import { handleUpdateTestimonialspace } from "../controllers/space/update";
import { handleDeleteTestimonialspace } from "../controllers/space/delete";
import upload from "../lib/multer";
import { refreshToken } from "../middlewares/refreshToken";
const spaceRouter = express.Router();

spaceRouter.post(
  "/createspace",
  refreshToken,
  authenticateToken,
  upload.single("logo"),
  handleAddTestimonialspace
);

spaceRouter.put(
  "/update/:space_id",
  refreshToken,
  authenticateToken,
  // validateRequest(combinedspaceSchema),
  handleUpdateTestimonialspace
);

spaceRouter.get(
  "/get/:space_name",
  handleFetchTestimonialspace
);

spaceRouter.get("/", handleFetchAllSpace);

spaceRouter.get(
  "/getall",
  refreshToken,
  authenticateToken,
  handleFetchAllTestimonialspace
);

spaceRouter.delete(
  "/delete",
  refreshToken,
  authenticateToken,
  handleDeleteTestimonialspace
);

spaceRouter.use("/testimonials", require("./testimonial"));

module.exports = spaceRouter;
