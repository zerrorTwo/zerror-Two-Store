import { memo, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  CircularProgress,
  Typography,
  Card,
  TextField,
} from "@mui/material";
import ButtonOutLined from "./ButtonOutLined.jsx";
import PopoverPaper from "../components/PopoverPaper.jsx";
import {
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useUploadCategoryImageMutation,
} from "../redux/api/categorySlice.js";
import { toast } from "react-toastify";
import { PRIMITIVE_URL } from "../redux/constants.js";

const CategoryList = memo(({ category, isLoading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [updateCategory, { isLoading: isLoadingUpdate }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isLoadingDelete }] =
    useDeleteCategoryMutation();
  const [uploadCategoryImage] = useUploadCategoryImageMutation();

  if (isLoading) {
    return <CircularProgress color="inherit" />;
  }

  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setSelectedImage(item.img);
    setImagePreview(item.img ? `${PRIMITIVE_URL}${item.img}` : null);
    setFormData({
      name: item.name || "",
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({
      name: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));

      try {
        const formData = new FormData();
        formData.append("image", file);

        const result = await uploadCategoryImage(formData).unwrap();

        if (result.image) {
          setSelectedImage(result.image);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Lỗi khi upload ảnh!");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      if (!selectedItem) return;

      const updateData = {
        ...formData,
        img: selectedImage,
      };

      await updateCategory({
        id: selectedItem._id,
        body: updateData,
      }).unwrap();

      toast.success("Cập nhật danh mục thành công!");
      handleClose();
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Lỗi khi cập nhật danh mục!");
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedItem) return;
      await deleteCategory({ _id: selectedItem._id }).unwrap();
      toast.success("Xóa danh mục thành công!");
      handleClose();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Lỗi khi xóa danh mục!");
    }
  };

  return (
    <Box>
      <Box display="flex" flexWrap="wrap" gap={2}>
        {category.map((item) => (
          <ButtonOutLined
            key={item._id}
            onClick={(event) => handleClick(event, item)}
          >
            {item.name}
          </ButtonOutLined>
        ))}
      </Box>

      <PopoverPaper
        anchorEl={anchorEl}
        handleClose={handleClose}
        updateBtn={!!selectedItem}
        deleteBtn={!!selectedItem}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        isLoadingUpdate={isLoadingUpdate}
        isLoadingDelete={isLoadingDelete}
      >
        <Box sx={{ m: "0 auto", display: "table", mt: 2 }}>
          <Card
            sx={{
              maxHeight: "160px",
              maxWidth: "160px",
              height: "160px",
              width: "160px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px dashed gray",
            }}
            onClick={() => document.getElementById("mainImgInput").click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Main Image"
                style={{
                  maxHeight: "160px",
                  maxWidth: "160px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Typography variant="body2">
                Click to upload main image
              </Typography>
            )}
            <input
              id="mainImgInput"
              type="file"
              hidden
              name="mainImg"
              onChange={handleImageChange}
            />
          </Card>
        </Box>

        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
        </Box>
      </PopoverPaper>
    </Box>
  );
});

CategoryList.displayName = "CategoryList";

CategoryList.propTypes = {
  category: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default CategoryList;
