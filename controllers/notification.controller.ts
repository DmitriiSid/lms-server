import NotificationModel from "../models/notification.model";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";

// get all notifications --- only for admin
export const getNotifications = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await NotificationModel.find().sort({ created_at: -1 });

        res.status(200).json({
            success: true,
            notifications,
        });


    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));

    }
});

// update notification status --- only for admin

export const updateNotification = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler("Notification not found", 404));
        } else {
            notification.status ? notification.status = "read" : notification.status;
        }

        await notification.save();

        const notifications = await NotificationModel.find().sort({ created_at: -1 });

        res.status(201).json({
            success: true,
            notifications,
        });
    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));

    }


});