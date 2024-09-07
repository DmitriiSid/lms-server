import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

// authenticate user
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
        return next(new ErrorHandler("Please login to access this resource", 401)); // Change status to 401
    }

    try {
        // Verify JWT
        const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload;

        if (!decoded) {
            return next(new ErrorHandler("Access token is not valid", 401)); // Change status to 401
        }

        // Fetch user from Redis by decoded token's ID
        const user = await redis.get(decoded.id);

        if (!user) {
            return next(new ErrorHandler("Please login to access this resource", 401)); // Change status to 401
        }

        // Attach user to the request object
        req.user = JSON.parse(user);

        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401)); // Catch verification errors
    }
});

// validate user role 

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler(`Role (${req.user?.role}) is not allowed to access this resource`, 403));
        }
        next();
    }
}