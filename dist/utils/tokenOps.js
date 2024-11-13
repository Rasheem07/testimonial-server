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
exports.deleteStoredRefreshToken = exports.getStoredRefreshToken = exports.storeRefreshToken = void 0;
const redis_1 = require("../lib/redis");
const storeRefreshToken = (userId, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.redisClient.set(String(userId), refreshToken, { EX: 7 * 24 * 60 * 60 }); // Expires in 7 days
});
exports.storeRefreshToken = storeRefreshToken;
const getStoredRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const storedToken = yield redis_1.redisClient.get(String(userId));
    return storedToken;
});
exports.getStoredRefreshToken = getStoredRefreshToken;
const deleteStoredRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.redisClient.del(String(userId));
});
exports.deleteStoredRefreshToken = deleteStoredRefreshToken;
