"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema, property = "body") {
    return (req, res, next) => {
        const result = schema.safeParse(req[property]);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.flatten(),
            });
        }
        req[property] = result.data;
        next();
    };
}
