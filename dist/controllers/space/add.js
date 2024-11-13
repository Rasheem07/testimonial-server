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
exports.handleAddTestimonialspace = handleAddTestimonialspace;
const InsertTestimonialspace_1 = require("../../actions/space/InsertTestimonialspace");
function handleAddTestimonialspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { spaces, thank_page, extra_settings } = req.body;
        // Check if there is a file uploaded
        try {
            const file = req.file; // for the file
            if (!file) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            // Insert testimonial space data
            yield (0, InsertTestimonialspace_1.insertTestimonialspaceData)(user_id, file, JSON.parse(spaces), JSON.parse(thank_page), JSON.parse(extra_settings));
            return res.json({ message: "Successfully created a space!" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
