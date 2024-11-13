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
exports.connectToRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: 'redis://redis-12273.c266.us-east-1-3.ec2.redns.redis-cloud.com:12273',
    username: "default",
    password: 'Xk68SZjKI6hSmFw30qDN4QCXJKqUujxp'
});
exports.redisClient = redisClient;
const connectToRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    yield redisClient.connect();
    console.log("redis connected succussfully!");
});
exports.connectToRedis = connectToRedis;
