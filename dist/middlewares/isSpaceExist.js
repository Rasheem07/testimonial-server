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
exports.doesSpaceExists = void 0;
const db_1 = require("../lib/db");
const doesSpaceExists = (req, // Use AuthenticatedRequest here
res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { spaces } = req.body;
    const space = yield db_1.PostgresClient.query('SELECT * FROM spaces where space_name=$1 LIMIT 1', [spaces.space_name]);
    if (space.rows[0]) {
        return res.json({ error: "Space with this name already exists" });
    }
    next();
});
exports.doesSpaceExists = doesSpaceExists;
