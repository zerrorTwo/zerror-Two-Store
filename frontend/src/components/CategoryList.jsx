import React, { memo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, CircularProgress, Typography, Card } from "@mui/material";
import ButtonOutLined from "./ButtonOutLined.jsx";
import PopoverPaper from "../components/PopoverPaper.jsx";
import {
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useUploadCategoryImageMutation,
} from "../redux/api/categorySlice.js";
import { toast } from "react-toastify";
import FormBase from "./FormBase.jsx";
import { PRIMITIVE_URL } from "../redux/constants.js";

const CategoryList = memo(({ category, isLoading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const formRef = useRef(null);
  const [updateCategory, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeleteCategoryMutation();
  const [uploadCategoryImage, { isLoading: isLoadingUpload }] =
    useUploadCategoryImageMutation(); // Image upload mutation

  if (isLoading) {
    return <CircularProgress color="inherit" />;
  }

  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
    setSelectedImage(item.img); // Set selected image on click
    setImagePreview(item.img ? `${PRIMITIVE_URL}${item.img}` : null); // Set image preview on click
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (id) => {
    try {
      let updatedImgUrl = selectedItem.img;

      if (selectedImage !== selectedItem.img) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const response = await uploadCategoryImage(formData).unwrap();
        updatedImgUrl = response.image;
      }

      const updatedData = formRef.current?.getFormData();
      const finalData = { ...selectedItem, ...updatedData, img: updatedImgUrl };

      await updateCategory({ id, ...finalData }).unwrap();
      if (errorUpdate) {
        toast.error(errorUpdate);
      } else {
        toast.success("Profile updated successfully");
        handleClose(); // Close the popover on success
      }
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (_id) => {
    try {
      await deleteCategory(_id).unwrap();
      if (errorDelete) {
        toast.error(errorDelete);
      } else {
        handleClose();
        toast.success("Delete successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Delete failed");
    }
  };

  return (
    <Box display={{ xs: "flex", md: "flex" }} sx={{ gap: 2, flexWrap: "wrap" }}>
      {category.length === 0 ? (
        <Typography>No categories available.</Typography>
      ) : (
        category.map((item) => (
          <React.Fragment key={item._id}>
            <ButtonOutLined
              onClick={(event) => handleClick(event, item)}
              text={item.name}
            />
          </React.Fragment>
        ))
      )}
      <PopoverPaper
        isLoadingUpdate={isLoadingUpdate || isLoadingUpload}
        isLoadingDelete={isLoadingDelete}
        item={selectedItem}
        open={Boolean(anchorEl)}
        updateBtn={true}
        deleteBtn={true}
        anchorEl={anchorEl}
        handleClose={handleClose}
        handleUpdate={() => handleUpdate(selectedItem._id)}
        handleDelete={() => handleDelete(selectedItem._id)}
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
        <FormBase ref={formRef} item={selectedItem || { _id: "", name: "" }} />
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
