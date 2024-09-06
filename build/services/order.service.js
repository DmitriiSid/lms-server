"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllOrdersService = exports.newOrder = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const catchAsyncError_1 = require("../middleware/catchAsyncError");
// create new order 
exports.newOrder = (0, catchAsyncError_1.CatchAsyncError)(async (data, res, next) => {
    const order = await order_model_1.default.create(data);
    res.status(201).json({
        success: true,
        order,
    });
});
// get all orders --- only for admin
const getAllOrdersService = async (res) => {
    const orders = await order_model_1.default.find().sort({ created_at: -1 });
    res.status(200).json({
        success: true,
        orders,
    });
};
exports.getAllOrdersService = getAllOrdersService;
