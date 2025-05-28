import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";
import { uploadToCloudinary } from "../../controllers/cloud.upload.controller.js";

const router = express.Router();
const __dirname = path.resolve();

const storage = multer.memoryStorage(); // Use memory storage for Cloudinary

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp|gif|bmp|tiff/;
  const mimetypes =
    /image\/jpe?g|image\/png|image\/webp|image\/gif|image\/bmp|image\/tiff/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

// Single multer instance
const upload = multer({ storage, fileFilter });

// Ensure upload directories exist (for local storage routes)
const uploadsDir = path.join(__dirname, "uploads");
const categoriesImgDir = path.join(uploadsDir, "categoriesImg");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(UploadsDir);
if (!fs.existsSync(categoriesImgDir)) fs.mkdirSync(categoriesImgDir);

// Upload to Cloudinary (supports avatar, category, product)
router.post("/cloudinary", upload.single("file"), uploadToCloudinary);

// Local image upload
router.post("/", upload.single("image"), (req, res) => {
  if (req.file) {
    // Save file to disk for local storage
    const storageDisk = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads/");
      },
      filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${extname}`);
      },
    });
    const uploadDisk = multer({ storage: storageDisk, fileFilter }).single("image");
    uploadDisk(req, res, (err) => {
      if (err) {
        res.status(400).send({ message: err.message });
      } else if (req.file) {
        res.status(200).send({
          message: "Image uploaded successfully",
          image: `/${req.file.path}`,
        });
      } else {
        res.status(400).send({ message: "No image file provided or invalid file type" });
      }
    });
  } else {
    res.status(400).send({ message: "No image file provided or invalid file type" });
  }
});

// Delete local image
router.delete("/", (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send({ message: "Filename is required" });
  }

  const filePath = path.join(__dirname, image);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.status(200).send({ message: "Image deleted successfully" });
  } else {
    res.status(404).send({ message: "File not found" });
  }
});

// Upload to categoriesImg folder
router.post("/category", (req, res) => {
  const storageCategoriesImg = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join("uploads", "categoriesImg"));
    },
    filename: (req, file, cb) => {
      const extname = path.extname(file.originalname);
      cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    },
  });

  const uploadCategoriesImg = multer({
    storage: storageCategoriesImg,
    fileFilter,
  }).single("image");

  uploadCategoriesImg(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully to categoriesImg",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export const uploadRoute = router;