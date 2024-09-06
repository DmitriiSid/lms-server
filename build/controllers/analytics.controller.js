"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderAnalytics = exports.getCoursesAnalytics = exports.getUserAnalytics = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const analytics_generator_1 = require("../utils/analytics.generator");
const user_models_1 = __importDefault(require("../models/user.models"));
const course_model_1 = __importDefault(require("../models/course.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
// get user analytics => /api/v1/get-users-analytics --- Only Admin
exports.getUserAnalytics = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const users = await (0, analytics_generator_1.generateLast12MonthsData)(user_models_1.default);
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get course analytics => /api/v1/get-courses-analytics --- Only Admin
exports.getCoursesAnalytics = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const courses = await (0, analytics_generator_1.generateLast12MonthsData)(course_model_1.default);
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
// get orders analytics => /api/v1/get-oreders-analytics --- Only Admin
exports.getOrderAnalytics = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const orders = await (0, analytics_generator_1.generateLast12MonthsData)(order_model_1.default);
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
