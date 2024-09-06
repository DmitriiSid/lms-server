"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNotification = exports.getNotifications = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
// get all notifications --- only for admin
exports.getNotifications = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const notifications = await notification_model_1.default.find().sort({ created_at: -1 });
        res.status(200).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
// update notification status --- only for admin
exports.updateNotification = (0, catchAsyncError_1.CatchAsyncError)(async (req, res, next) => {
    try {
        const notification = await notification_model_1.default.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler_1.default("Notification not found", 404));
        }
        else {
            notification.status ? notification.status = "read" : notification.status;
        }
        await notification.save();
        const notifications = await notification_model_1.default.find().sort({ created_at: -1 });
        res.status(201).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
