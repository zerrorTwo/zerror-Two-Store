import { Link } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import CartVariationPopover from "./CartVariationPopover";
import PropTypes from "prop-types";
import ConfirmDialog from "../ConfirmDialog";
import {
  useRemoveProductMutation,
  useUpdateCheckoutMutation,
} from "../../redux/api/cartSlice";
import { toast } from "react-toastify";
import QuantityGroupWithAPI from "../QuantityGroupApi";
import Grid2 from "@mui/material/Grid2";
import { Divider } from "@mui/material";
import CouponPopover from "../Coupon/CouponPopover";
import { useGetProductCouponQuery } from "../../redux/api/couponSlice";

function CartDetailItem({
  productId,
  productName,
  productPrice,
  productSlug,
  productImages,
  checkout,
  variation,
  allVariations,
  refetch,
  onProductCouponSelect, // Thêm prop mới
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [couponAnchorEl, setCouponAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);
  const [selectedProductCoupon, setSelectedProductCoupon] = useState(null);
  const [deleteProduct, { isLoading }] = useRemoveProductMutation();
  const [updateCheckout] = useUpdateCheckoutMutation();
  const { data: availableCoupons, isLoading: isLoadingCoupons } =
    useGetProductCouponQuery(productId);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct({
        state: "ACTIVE",
        products: [{ productId, variations: [{ type: variation.type }] }],
      }).unwrap();
      setDialogOpen(false);
      toast.success("Successfully removed product from cart.");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error(error?.data?.message || "Something went wrong.");
    }
  };

  const handleCheckboxChange = async () => {
    setBackdropOpen(true);
    const requestData = {
      products: [
        {
          productId,
          variations: [{ type: variation.type }],
        },
      ],
    };

    try {
      await updateCheckout(requestData).unwrap();

      refetch();
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái giỏ hàng.", error?.stack);
    } finally {
      setBackdropOpen(false);
    }
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleCouponPopoverOpen = (event) => {
    setCouponAnchorEl(event.currentTarget);
  };
  const handleCouponPopoverClose = () => {
    setCouponAnchorEl(null);
  };

  const handleSetSelectedCoupon = (coupons) => {
    const selectedCoupon = coupons.PRODUCT;
    setSelectedProductCoupon(selectedCoupon);
    if (selectedCoupon && onProductCouponSelect) {
      onProductCouponSelect(selectedCoupon);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box
      sx={{
        p: 1,
        py: 2,
        border: "1px solid silver",
        borderRadius: 1,
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px",
      }}
    >
      <Grid2 container sx={{ alignItems: "center" }}>
        <Grid2 size={6}>
          <Box display="flex" alignItems="center" gap={0}>
            <Checkbox
              checked={checkout}
              onChange={handleCheckboxChange}
              sx={{
                color: "text.primary",
                "&.Mui-checked": { color: "secondary.main" },
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
                  image={`${productImages}`}
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
                      "&:hover": { color: "secondary.main" },
                    }}
                  >
                    {productName}
                  </Typography>
                </Link>
                {variation.type && (
                  <>
                    <Box
                      onClick={handleClick}
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
                        cursor: "pointer",
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
                        }}
                      >
                        {Object.values(variation.type).join(", ")}
                      </Typography>
                      <ArrowDropDownIcon fontSize="small" />
                    </Box>

                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    >
                      <CartVariationPopover
                        productId={productId}
                        data={allVariations}
                        onClose={handleClose}
                        initAttribute={variation?.type}
                      />
                    </Popover>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Grid2>

        <Grid2 size={6}>
          <Grid2 container justifyContent="center" alignItems="center">
            <Grid2 size={4} textAlign="center">
              <Typography fontWeight="bold">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(variation.price || productPrice)}
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

      {checkout && <Divider sx={{ mt: 2 }} />}

      <Box display={"flex"} justifyContent={"flex-end"}>
        {checkout && (
          <Typography
            color="info.main"
            variant="body2"
            sx={{ mt: 2, cursor: "pointer" }}
            onClick={handleCouponPopoverOpen}
          >
            Add product coupon
          </Typography>
        )}
      </Box>

      <CouponPopover
        anchorEl={couponAnchorEl}
        onClose={handleCouponPopoverClose}
        selectedCoupons={{ PRODUCT: selectedProductCoupon }}
        setSelectedCoupons={handleSetSelectedCoupon}
        checkedTotalPrice={
          (variation.price || productPrice) * variation.quantity
        }
        availableCoupons={availableCoupons}
        isLoadingCoupons={isLoadingCoupons}
      />

      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

CartDetailItem.propTypes = {
  productId: PropTypes.string.isRequired,
  productName: PropTypes.string.isRequired,
  productPrice: PropTypes.number.isRequired,
  productSlug: PropTypes.string.isRequired,
  productImages: PropTypes.string.isRequired,
  checkout: PropTypes.bool.isRequired,
  variation: PropTypes.object.isRequired,
  allVariations: PropTypes.object.isRequired,
  refetch: PropTypes.func.isRequired,
  onProductCouponSelect: PropTypes.func,
};

export default CartDetailItem;
