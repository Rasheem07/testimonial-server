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
exports.default = resendOTP;
const crypto_1 = require("crypto");
const nodemailer_1 = __importDefault(require("../../services/nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../../lib/db");
function resendOTP(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user } = req.body;
        try {
            const client = yield db_1.PostgresClient.connect();
            const User = yield client.query("SELECT * FROM users where email = $1 LIMIT 1", [user]);
            if (!User.rows[0]) {
                return res
                    .status(403)
                    .json({ error: "User with this email does not exist!" });
            }
            yield db_1.PostgresClient.query("DELETE FROM otps where user = $1", [
                User.rows[0].email,
            ]);
            const OTP = (0, crypto_1.randomInt)(100000, 999999);
            const salt = bcryptjs_1.default.genSaltSync(10);
            const hashedOTP = bcryptjs_1.default.hashSync(OTP.toString(), salt);
            yield client.query("INSERT INTO otps (user, otp) VALUES ($1, $2)", [
                User.rows[0].email,
                hashedOTP,
            ]);
            yield client.release();
            const sendmail = yield (0, nodemailer_1.default)(user, OTP);
            if (!sendmail) {
                return res
                    .status(500)
                    .json({ error: "There was some problem sending the email!" });
            }
            res.status(201).json({ message: "OTP resent successfully" });
        }
        catch (error) {
            res
                .status(500)
                .json({ error: "An error occurred while resending the OTP" });
        }
    });
}
