import { Response } from "express";
import { redis } from "../utils/redis";
import userModel from "../models/user.models";

// get user by id
export const getUserById = async (id: string, res: Response) => {
    const userJson = await redis.get(id);

    if (userJson) {
        const user = JSON.parse(userJson);
        return res.status(200).json({
            success: true,
            user,
        });
    }
}

// Get all users
export const getAllUsersService = async (res: Response) => {
    const users = await userModel.find().sort({ created_at: -1 });

    res.status(200).json({
        success: true,
        users,
    });
}

// update user role
// export const updateUserRoleService = async (res: Response, id: string, role: string,) => {
//     const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

//     res.status(200).json({
//         success: true,
//         user
//     });
// }
export const updateUserRoleService = async (res: Response, email: string, role: string) => {
    try {
        // Find user by email and update their role
        const user = await userModel.findOneAndUpdate(
            { email }, // Find user by email
            { role },  // Update role
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};