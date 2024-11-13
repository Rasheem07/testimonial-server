"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateToken_1 = require("../middlewares/authenticateToken");
const add_1 = require("../controllers/space/add");
const fetch_1 = require("../controllers/space/fetch");
const update_1 = require("../controllers/space/update");
const delete_1 = require("../controllers/space/delete");
const multer_1 = __importDefault(require("../lib/multer"));
const refreshToken_1 = require("../middlewares/refreshToken");
const spaceRouter = express_1.default.Router();
spaceRouter.post("/createspace", refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, multer_1.default.single("logo"), add_1.handleAddTestimonialspace);
spaceRouter.put("/update/:space_id", refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, 
// validateRequest(combinedspaceSchema),
update_1.handleUpdateTestimonialspace);
spaceRouter.get("/get/:space_name", fetch_1.handleFetchTestimonialspace);
spaceRouter.get("/", fetch_1.handleFetchAllSpace);
spaceRouter.get("/getall", refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, fetch_1.handleFetchAllTestimonialspace);
spaceRouter.delete("/delete", refreshToken_1.refreshToken, authenticateToken_1.authenticateToken, delete_1.handleDeleteTestimonialspace);
spaceRouter.use("/testimonials", require("./testimonial"));
module.exports = spaceRouter;
