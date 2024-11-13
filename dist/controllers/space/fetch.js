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
exports.handleFetchTestimonialspace = handleFetchTestimonialspace;
exports.handleFetchAllTestimonialspace = handleFetchAllTestimonialspace;
exports.handleFetchAllSpace = handleFetchAllSpace;
const fetchspaceData_1 = require("../../actions/space/fetchspaceData");
const fetchallSpace_1 = require("../../actions/space/fetchallSpace");
const db_1 = require("../../lib/db");
function handleFetchTestimonialspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { space_name } = req.params;
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (req.space == 1) {
            res.json({ type: "error", error: "space does not exists!" });
        }
        try {
            const data = yield (0, fetchspaceData_1.fetchTestimonialspaceData)(space_name);
            // if (!data) {
            //   res.status(404).json({ message: "Testimonial space not found" });
            //   return []
            // }
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
function handleFetchAllTestimonialspace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        try {
            const data = yield (0, fetchallSpace_1.fetchAllTestimonialspace)(user_id);
            res.json({ data });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
function handleFetchAllSpace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield db_1.PostgresClient.connect();
            const spaces = yield client.query('SELECT * from spaces');
            res.json(spaces.rows);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
