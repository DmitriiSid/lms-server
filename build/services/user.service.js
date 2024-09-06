"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleService = exports.getAllUsersService = exports.getUserById = void 0;
const redis_1 = require("../utils/redis");
const user_models_1 = __importDefault(require("../models/user.models"));
// get user by id
const getUserById = async (id, res) => {
    const userJson = await redis_1.redis.get(id);
    if (userJson) {
        const user = JSON.parse(userJson);
        return res.status(200).json({
            success: true,
            user,
        });
    }
};
exports.getUserById = getUserById;
// Get all users
const getAllUsersService = async (res) => {
    const users = await user_models_1.default.find().sort({ created_at: -1 });
    res.status(200).json({
        success: true,
        users,
    });
};
exports.getAllUsersService = getAllUsersService;
// update user role
// export const updateUserRoleService = async (res: Response, id: string, role: string,) => {
//     const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });
//     res.status(200).json({
//         success: true,
//         user
//     });
// }
const updateUserRoleService = async (res, email, role) => {
    try {
        // Find user by email and update their role
        const user = await user_models_1.default.findOneAndUpdate({ email }, // Find user by email
        { role }, // Update role
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.updateUserRoleService = updateUserRoleService;
