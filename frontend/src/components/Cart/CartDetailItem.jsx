// Import các thư viện cần thiết
import { Link } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import {
  Box,
  CardMedia,
  Grid2,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CartVariationPopover from "./CartVariationPopover";
import PropTypes from "prop-types";
import { PRIMITIVE_URL } from "../../redux/constants";
import ConfirmDialog from "../ConfirmDialog";
import { useRemoveProductMutation } from "../../redux/api/cartSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import QuantityGroupWithAPI from "../QuantityGroupApi";

function CartDetailItem({
  productId,
  productName,
  productSlug,
  productImages,
  variation,
  selected = [],
  onSelect,
  allVariations,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteProduct, { isLoading }] = useRemoveProductMutation();
  const userId = useSelector(selectCurrentUser)?._id;

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleConfirmDelete = async () => {
    try {
      const data = {
        userId,
        state: "ACTIVE",
        products: [
          {
            productId,
            variations: [{ type: variation.type }],
          },
        ],
      };

      await deleteProduct(data).unwrap();
      setDialogOpen(false);
      toast.success("Successfully removed product from cart.");
    } catch (error) {
      console.error("Delete Error:", error);
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const itemId = `${productId}-${JSON.stringify(variation.type)}`;
  const isChecked = selected.includes(itemId);

  const handleCheckboxChange = (event) => {
    onSelect(itemId, event.target.checked);
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box
      sx={{
        p: 1,
        py: 2,
        border: "1px solid silver",
        borderRadius: 1,
        boxShadow:
          "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
      }}
    >
      <Grid2 container sx={{ alignItems: "center" }}>
        <Grid2 size={6}>
          <Box display="flex" alignItems="center" gap={0}>
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxChange}
              sx={{
                color: "text.primary",
                "&.Mui-checked": {
                  color: "secondary.main",
                },
              }}
            />
            <Box display="flex" flexDirection="row" gap={1} overflow="hidden">
              <Link
                to={`/products/${productSlug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <CardMedia
                  component="img"
                  sx={{ height: "80px", width: "auto", objectFit: "cover" }}
                  alt={productName}
                  image={`${PRIMITIVE_URL}${productImages}`}
                  loading="lazy"
                />
              </Link>
              <Box display="flex" flexDirection="column">
                <Link
                  to={`/product/${productSlug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "common.black",
                      lineHeight: "20px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 2,
                      textOverflow: "ellipsis",
                      wordBreak: "break-all",
                      maxHeight: "40px",
                      "&:hover": {
                        color: "secondary.main",
                      },
                    }}
                  >
                    {productName}
                  </Typography>
                </Link>
                {variation.type ? (
                  <>
                    <Box
                      onClick={variation?.type ? handleClick : undefined}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      border={1}
                      borderColor="grey.300"
                      borderRadius={1}
                      px={1}
                      py={0.5}
                      mt={1}
                      sx={{
                        cursor: variation?.type ? "pointer" : "default",
                        maxWidth: "200px",
                        minWidth: "200px",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          color: variation?.type
                            ? "text.primary"
                            : "text.disabled",
                        }}
                      >
                        {variation?.type
                          ? Object.values(variation.type).join(", ")
                          : "No variations"}
                      </Typography>
                      {variation?.type && (
                        <ArrowDropDownIcon fontSize="small" />
                      )}
                    </Box>

                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <CartVariationPopover
                        productId={productId}
                        userId={userId}
                        data={allVariations}
                        onClose={handleClose}
                        initAttribute={variation?.type}
                      />
                    </Popover>
                  </>
                ) : null}
              </Box>
            </Box>
          </Box>
        </Grid2>

        <Grid2 size={6}>
          <Grid2 container justifyContent="center" alignItems="center">
            <Grid2 size={4} textAlign="center">
              <Typography fontWeight="bold" color="secondary.main">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(variation.price)}
              </Typography>
            </Grid2>
            <Grid2 size={5}>
              <Box display="flex" justifyContent="center">
                <QuantityGroupWithAPI
                  productId={productId}
                  initialQuantity={variation?.quantity}
                  variationType={variation.type}
                />
              </Box>
            </Grid2>
            <Grid2 size={3} textAlign="center">
              <Tooltip onClick={handleOpenDialog} title="Delete">
                <DeleteIcon
                  color="error"
                  sx={{ cursor: "pointer" }}
                  fontSize="small"
                />
              </Tooltip>
              <ConfirmDialog
                isLoading={isLoading}
                open={dialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmDelete}
                itemCount={1}
              />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}

CartDetailItem.propTypes = {
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  productSlug: PropTypes.string.isRequired,
  productImages: PropTypes.string.isRequired,
  variation: PropTypes.object.isRequired,
  allVariations: PropTypes.object.isRequired,
  selected: PropTypes.array,
  onSelect: PropTypes.func,
};

export default CartDetailItem;
