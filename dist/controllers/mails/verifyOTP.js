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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = verifyOTP;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../lib/db");
function verifyOTP(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, OTP } = req.body;
        const client = yield db_1.PostgresClient.connect();
        const User = yield client.query("SELECT * FROM otps where user = $1 LIMIT 1", [email]);
        yield client.release();
        const isOTPmatch = bcryptjs_1.default.compareSync(OTP.toString(), User === null || User === void 0 ? void 0 : User.rows[0].otp);
        if (!isOTPmatch) {
            res.status(404).json({ error: "OTP does not match!" });
        }
        yield db_1.PostgresClient.query("DELETE FROM  otps where user = $1", [email]);
        res.status(202).json({ message: "successfully logined!" });
    });
}
