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
exports.uploadImageFile = void 0;
const base64_arraybuffer_1 = require("base64-arraybuffer");
const supabase_1 = require("../lib/supabase");
const uploadImageFile = (bucket, file) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('Control reached file upload');
        console.log('File object:', file);
        if (!file.buffer) {
            throw new Error("File buffer is undefined");
        }
        const decodedFile = (0, base64_arraybuffer_1.decode)((_a = file.buffer) === null || _a === void 0 ? void 0 : _a.toString("base64"));
        // Upload to Supabase
        const { data, error } = yield supabase_1.supabase.storage
            .from(bucket)
            .upload(file.originalname, decodedFile, {
            contentType: file.mimetype,
            cacheControl: "3600",
        });
        if (error) {
            console.error("Error uploading file:", error.message);
            throw new Error("Error uploading file");
        }
        // Fetch the public URL of the uploaded file
        const { data: urlData } = yield supabase_1.supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);
        const publicUrl = urlData.publicUrl;
        return publicUrl;
    }
    catch (err) {
        console.error("Error in uploadFile:", err);
        throw err;
    }
});
exports.uploadImageFile = uploadImageFile;
