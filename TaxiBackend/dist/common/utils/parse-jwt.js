"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJwt = parseJwt;
const jwt = require("jsonwebtoken");
function parseJwt(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    }
    catch (err) {
        throw new Error('Invalid JWT');
    }
}
//# sourceMappingURL=parse-jwt.js.map