import { useState } from "react";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import { Button, Typography, Popper, Fade } from "@mui/material";
import {
  useCreateNewProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../../redux/api/productSlice";
import { toast } from "react-toastify";

function ConfirmTab({
  formData,
  onPre,
  handleResetFormData,
  create = false,
  id = null,
}) {
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [createProduct] = useCreateNewProductMutation();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const { image } = await uploadProductImage(formData).unwrap();
    return image;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      if (create) {
        try {
          let mainImgUrl = formData.mainImg;
          mainImgUrl = await uploadImage(formData.mainImg);

          const imgUrls = await Promise.all(
            formData?.img.map(async (file) => {
              // Check if file is a File object before uploading
              if (file instanceof File) {
                return await uploadImage(file); // Upload only if it's a new file
              }
              return file; // Return existing image URLs directly
            })
          );

          const updatedFormData = {
            ...formData,
            mainImg: mainImgUrl,
            img: imgUrls,
          };
          await createProduct({ data: updatedFormData }).unwrap();
          toast.success("Product created successfully");

          handleResetFormData(); // Call reset function
        } catch (error) {
          toast.error(error?.message || error?.data?.message);
        }
      } else {
        try {
          const updated = await updateProduct({
            _id: id,
            updatedFormData: formData,
          }).unwrap();
          if (updated) {
            toast.success("Product updated successfully");
          }
        } catch (error) {
          toast.error(error?.message || error?.data?.message);
        }
      }

      setOpen(false); // Close the confirmation popper after submission
    } catch (error) {
      console.error("Failed to submit product", error);
    }
  };

  const handleClose = () => {
    setOpen(false); // Close the confirmation popper without submitting
  };

  return (
    <>
      <Box display={"flex"} flexDirection={"column"} gap={2}>
        <Typography variant="body1">
          Be careful and double-check your information. Are you sure you want to
          create this product?
        </Typography>
      </Box>
      <Box
        marginTop="auto"
        justifyContent={"flex-end"}
        display={"flex"}
        gap={2}
      >
        <Button
          sx={{
            color: "white",
            bgcolor: "secondary.main",
          }}
          onClick={onPre}
        >
          Pre
        </Button>
        <Button
          sx={{
            color: "white",
            bgcolor: "secondary.main",
          }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>

      {/* Popper for confirmation */}
      <Popper open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Box sx={{ border: 1, p: 2, bgcolor: "background.paper" }}>
              <Typography variant="body1">
                Are you sure you want to submit?
              </Typography>
              <Box display="flex" gap={2} marginTop={2}>
                <Button
                  sx={{ color: "white", bgcolor: "secondary.main" }}
                  onClick={handleConfirmSubmit}
                >
                  Yes
                </Button>
                <Button
                  sx={{ color: "white", bgcolor: "error.main" }}
                  onClick={handleClose}
                >
                  No
                </Button>
              </Box>
            </Box>
          </Fade>
        )}
      </Popper>
    </>
  );
}

ConfirmTab.propTypes = {
  formData: PropTypes.object.isRequired,
  onPre: PropTypes.func.isRequired,
  handleResetFormData: PropTypes.func.isRequired,
  create: PropTypes.bool,
  id: PropTypes.string,
};

export default ConfirmTab;
