import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";


// create layout
export const createLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
        const isTypeExist = await LayoutModel.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler(`Type ${type} already exists`, 400));
        }

        if (type === "Banner") {
            const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;

            const data = image.startsWith("https") ? bannerData : await cloudinary.v2.uploader.upload(image, { folder: "layout" });
            //const myCloude = await cloudinary.v2.uploader.upload(image, { folder: "layout" });

            const banner = {
                type: "Banner",

                image: {
                    public_id: image.startsWith("https")
                        ? bannerData?.banner.image.public_id
                        : data?.public_id,

                    url: image.startsWith("https")
                        ? bannerData?.banner.image.url
                        : data?.secure_url,
                },
                title,
                subTitle,
            };
            await LayoutModel.findByIdAndUpdate(bannerData?._id, { banner });
        };


        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(faq.map(async (item: any) => {
                return {
                    question: item.question,
                    answer: item.answer,
                }

            }));
            await LayoutModel.create({ type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(categories.map(async (item: any) => {
                return {
                    title: item.title,
                };

            })
            );
            await LayoutModel.create({
                type: "Categories",
                categories: categoriesItems,
            });
        }

        res.status(200).json({
            success: true,
            message: "Layout created successfully",
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));
    }
});

// Edit layout --- only for admin
export const editLayout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type === "Banner") {
            const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;
            const data = image.startsWith("https") ? bannerData : await cloudinary.v2.uploader.upload(image, { folder: "layout" });

            const banner = {
                type: "Banner",
                image: {
                    public_id: image.startsWith("https")
                        ? bannerData.banner.image.public_id
                        : data?.public_id,
                    url: image.startsWith("https")
                        ? bannerData.banner.image.url
                        : data?.secure_url,
                },
                title,
                subTitle,
            };

            await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
        }

        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItem = await LayoutModel.findOne({ type: "FAQ" });
            const faqItems = await Promise.all(faq.map(async (item: any) => {
                return {
                    question: item.question,
                    answer: item.answer,
                }

            }));
            await LayoutModel.findByIdAndUpdate(faqItem?._id, { type: "FAQ", faq: faqItems });
        }
        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesData = await LayoutModel.findOne({ type: "Categories" });
            const categoriesItems = await Promise.all(categories.map(async (item: any) => {
                return {
                    title: item.title,
                };

            })
            );
            await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
                type: "Categories",
                categories: categoriesItems,
            });
        }

        res.status(200).json({
            success: true,
            message: "Layout updated successfully",
        });

    } catch (error: any) {
        next(new ErrorHandler(error.message, 500));

    }
});

// get layout by type
export const getLayoutByType = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { type } = req.params;
            const layout = await LayoutModel.findOne({ type });

            res.status(201).json({
                success: true,
                layout,
            });
        } catch (error: any) {
            next(new ErrorHandler(error.message, 500));

        }
    });