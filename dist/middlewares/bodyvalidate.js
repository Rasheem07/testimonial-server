"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const validateRequest = (body) => {
    return (req, res, next) => {
        var _a;
        const { error } = body.validate(req.body, { abortEarly: false });
        if (error) {
            return res
                .status(400)
                .json({
                type: ((_a = error.details[0].context) === null || _a === void 0 ? void 0 : _a.key) || "",
                error: error.details[0].message,
            });
        }
        next();
    };
};
exports.validateRequest = validateRequest;
