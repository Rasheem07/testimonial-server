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
exports.connectToPostgresDatabase = exports.PostgresClient = void 0;
const pg_1 = require("pg");
const shema_1 = require("../utils/shema");
const user_1 = require("../schemas/user");
const otp_1 = require("../schemas/otp");
const space_1 = require("../schemas/space");
const testimonial_1 = require("../schemas/testimonial");
// Create a new PostgreSQL client
exports.PostgresClient = new pg_1.Pool({
    user: "neondb_owner", // Replace with your PostgreSQL username
    host: "ep-wispy-sea-a5okubxl-pooler.us-east-2.aws.neon.tech",
    database: "neondb", // Replace with your database name
    password: "UD8XwLl2yAMb",
    ssl: true,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
    min: 0,
    max: 10,
    keepAlive: true
});
const setupDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, shema_1.createSchema)(user_1.userSchema);
    yield (0, shema_1.createSchema)(otp_1.OTPschema);
    yield (0, space_1.createSpaceSchema)();
    yield (0, shema_1.createSchema)(testimonial_1.textTestimonialSchema);
    yield (0, shema_1.createSchema)(testimonial_1.videoTestimonialSchema);
    yield (0, shema_1.createSchema)(testimonial_1.socialTestimonialSchema);
});
const connectToPostgresDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield exports.PostgresClient.connect();
    try {
        console.log("Connected to PostgreSQL");
        yield setupDatabase(); // Call setupDatabase after successful connection
    }
    catch (err) {
        console.error("Error setting up PostgreSQL", err.stack);
    }
    finally {
        client.on("error", () => null);
        // Optionally end the pool after initialization if not needed for further queries
        yield client.release();
    }
});
exports.connectToPostgresDatabase = connectToPostgresDatabase;
