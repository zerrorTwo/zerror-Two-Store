import { v2 as cloudinary } from "cloudinary";
import mime from "mime-types";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

// Configure Cloudinary
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

// Folder mappings for Cloudinary
const FOLDER_MAPPINGS = {
    avatar: "avatars",
    category: "categories",
    product: "products",
};

export const uploadFileToCloudinary = async (file, folderType) => {
    try {
        if (!file) {
            throw new Error("No file provided");
        }
        if (!FOLDER_MAPPINGS[folderType]) {
            throw new Error(`Invalid folder type: ${folderType}`);
        }

        const mimeType = mime.lookup(file.originalname) || file.mimetype;
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                    folder: FOLDER_MAPPINGS[folderType],
                    public_id: path.parse(file.originalname).name, // Use filename without extension
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(file.buffer);
        });

        return {
            fileId: result.public_id,
            viewLink: result.secure_url, // Direct URL for <img> tags
        };
    } catch (error) {
        throw new Error(`Upload to Cloudinary failed: ${error.message}`);
    }
};