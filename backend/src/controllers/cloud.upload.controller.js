import { uploadFileToCloudinary } from "../services/cloud.upload.service.js";

export const uploadToCloudinary = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const folderType = req.body.folderType || "category"; // Default to 'category'
        const result = await uploadFileToCloudinary(req.file, folderType);

        res.status(200).json({
            message: `File uploaded to Cloudinary (${folderType})`,
            fileId: result.fileId,
            viewLink: result.viewLink,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: error.message });
    }
};