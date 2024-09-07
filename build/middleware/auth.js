"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticated = void 0;
const catchAsyncError_1 = require("./catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../utils/redis");
// authenticate user
exports.isAuthenticated = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler_1.default("Please login to access this resource", 401)); // Change status to 401
    }
    try {
        // Verify JWT
        const decoded = jsonwebtoken_1.default.verify(access_token, process.env.ACCESS_TOKEN);
        if (!decoded) {
            return next(new ErrorHandler_1.default("Access token is not valid", 401)); // Change status to 401
        }
        // Fetch user from Redis by decoded token's ID
        const user = await redis_1.redis.get(decoded.id);
        if (!user) {
            return next(new ErrorHandler_1.default("Please login to access this resource", 401)); // Change status to 401
        }
        // Attach user to the request object
        req.user = JSON.parse(user);
        next();
    }
    catch (error) {
        return next(new ErrorHandler_1.default("Invalid or expired token", 401)); // Catch verification errors
    }
});
// validate user role 
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler_1.default(`Role (${req.user?.role}) is not allowed to access this resource`, 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
