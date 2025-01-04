import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

const __dirname = path.resolve();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

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

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

router.delete("/", (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send({ message: "Filename is required" });
  }

  const filePath = path.join(__dirname, image);
  // console.log(filePath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.status(200).send({ message: "Image deleted successfully" });
  } else {
    res.status(404).send({ message: "File not found" });
  }
});

// Route mới để upload ảnh vào thư mục categoriesImg
router.post("/category", (req, res) => {
  const storageCategoriesImg = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join("uploads", "categoriesImg")); // Lưu vào thư mục uploads/categoriesImg
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
