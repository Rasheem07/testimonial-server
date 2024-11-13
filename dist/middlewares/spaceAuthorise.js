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
exports.spaceAuthorise = void 0;
const db_1 = require("../lib/db");
const spaceAuthorise = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const space_id = req.body.space_id;
    try {
        const spaceAuth = yield db_1.PostgresClient.query("SELECT * FROM spaces where id = $1 AND user_id = $2 LIMIT 1", [space_id, user_id]);
        if (!spaceAuth.rows[0]) { }
        next();
    }
    catch (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ error: "Invalid token!" });
    }
});
exports.spaceAuthorise = spaceAuthorise;
