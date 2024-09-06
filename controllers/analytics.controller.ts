import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import userModel from "../models/user.models";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";

// get user analytics => /api/v1/get-users-analytics --- Only Admin
export const getUserAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await generateLast12MonthsData(userModel);

            res.status(200).json({
                success: true,
                users,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));

        }


    }
);

// get course analytics => /api/v1/get-courses-analytics --- Only Admin
export const getCoursesAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await generateLast12MonthsData(CourseModel);

            res.status(200).json({
                success: true,
                courses,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));

        }


    }
);

// get orders analytics => /api/v1/get-oreders-analytics --- Only Admin
export const getOrderAnalytics = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orders = await generateLast12MonthsData(OrderModel);

            res.status(200).json({
                success: true,
                orders,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));

        }


    }
);