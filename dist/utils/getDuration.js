"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffprobe_static_1 = __importDefault(require("ffprobe-static"));
// Set the ffprobe path for fluent-ffmpeg
fluent_ffmpeg_1.default.setFfprobePath(ffprobe_static_1.default.path);
const getVideoDuration = (url) => {
    return new Promise((resolve, reject) => {
        (0, fluent_ffmpeg_1.default)(url)
            .ffprobe((err, metadata) => {
            if (err) {
                return reject(err);
            }
            const duration = metadata.format.duration;
            if (typeof duration === 'number') {
                resolve(duration);
            }
            else {
                reject(new Error('Duration not found'));
            }
        });
    });
};
exports.default = getVideoDuration;
