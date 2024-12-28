import React, { memo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Box, CircularProgress, Typography } from "@mui/material";
import ButtonOutLined from "./ButtonOutLined.jsx";
import PopoverPaper from "../components/PopoverPaper.jsx";
import {
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../redux/api/categorySlice.js";
import { toast } from "react-toastify";
import FormBase from "./FormBase.jsx";

const CategoryList = memo(({ category, isLoading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const formRef = useRef(null);
  const [updateCategory, { isLoading: isLoadingUpdate, error: errorUpdate }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeleteCategoryMutation();

  if (isLoading) {
    return <CircularProgress color="inherit" />;
  }

  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleUpdate = async (id) => {
    try {
      const formData = formRef.current?.getFormData();
      await updateCategory({ id, ...formData }).unwrap();
      if (errorUpdate) {
        toast.error(errorUpdate);
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (_id) => {
    try {
      await deleteCategory(_id).unwrap();
      if (errorDelete) {
        toast.error(errorDelete);
      }
      handleClose();

      toast.success("Delete successfully");
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
        isLoadingUpdate={isLoadingUpdate}
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
