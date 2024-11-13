"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.password = exports.email = void 0;
const email = RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
exports.email = email;
const password = RegExp('^(?=.*[A-Z])(?=.*\d).{8,}$');
exports.password = password;
