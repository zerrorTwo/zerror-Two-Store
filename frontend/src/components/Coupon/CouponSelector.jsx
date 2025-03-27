import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CouponPopover from "./CouponPopover";

function CouponSelector({
  selectedCoupon,
  setSelectedCoupon,
  selectedCoupons,
  setSelectedCoupons,
  disabled = false,
}) {

  const [couponAnchorEl, setCouponAnchorEl] = useState(null);

  const handleCouponPopoverOpen = (event) => {
    if (!disabled) {
      setCouponAnchorEl(event.currentTarget);
    }
  };

  const handleCouponPopoverClose = () => {
    setCouponAnchorEl(null);
  };

  const activeCoupons = selectedCoupons
    ? Object.values(selectedCoupons).filter(Boolean)
    : selectedCoupon
    ? [selectedCoupon]
    : [];

  return (
    <>
      <Box
        display="flex"
        justifyContent={activeCoupons.length > 0 ? "space-between" : "center"}
        alignItems="center"
        gap={2}
      >
        <Typography variant="body1">Platform Voucher</Typography>
        <Typography
          variant="body2"
          color="primary.main"
          sx={{
            cursor: disabled ? "default" : "pointer",
            textDecoration: "underline",
            display: disabled ? "none" : "inline",
          }}
          onClick={handleCouponPopoverOpen}
          disabled={disabled}
        >
          {activeCoupons.length > 0 ? "Thay đổi" : ""}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          my: 1,
          color: activeCoupons.length > 0 ? "secondary.main" : "#05a",
        }}
      >
        {activeCoupons.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {activeCoupons.map((coupon) => (
              <Chip
                key={coupon._id}
                label={coupon.code}
                size="small"
                sx={{
                  bgcolor:
                    coupon.target_type === "PRODUCT"
                      ? "rgba(255, 0, 127, 0.1)"
                      : coupon.target_type === "FREESHIPPING"
                      ? "rgba(0, 127, 255, 0.1)"
                      : "rgba(255, 127, 0, 0.1)",
                  color:
                    coupon.target_type === "PRODUCT"
                      ? "error.main"
                      : coupon.target_type === "FREESHIPPING"
                      ? "info.dark"
                      : "warning.main",
                  borderColor:
                    coupon.target_type === "PRODUCT"
                      ? "error.main"
                      : coupon.target_type === "FREESHIPPING"
                      ? "info.dark"
                      : "warning.main",
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={handleCouponPopoverOpen}
          >
            Chọn hoặc nhập mã
          </Typography>
        )}
      </Box>

      <CouponPopover
        anchorEl={couponAnchorEl}
        onClose={handleCouponPopoverClose}
        selectedCoupon={selectedCoupon}
        setSelectedCoupon={setSelectedCoupon}
        selectedCoupons={selectedCoupons}
        setSelectedCoupons={setSelectedCoupons}
      />
    </>
  );
}

CouponSelector.propTypes = {
  selectedCoupon: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    code: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.number,
    description: PropTypes.string,
    target_type: PropTypes.string,
  }),
  setSelectedCoupon: PropTypes.func,
  selectedCoupons: PropTypes.object,
  setSelectedCoupons: PropTypes.func,
  disabled: PropTypes.bool,
};

export default CouponSelector;
