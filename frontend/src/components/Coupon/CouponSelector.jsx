import { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CouponPopover from "./CouponPopover";

function CouponSelector({
  checkedTotalPrice,
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

  const activeCoupons = Object.values(selectedCoupons).filter(Boolean);

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
        selectedCoupons={selectedCoupons}
        setSelectedCoupons={setSelectedCoupons}
        checkedTotalPrice={checkedTotalPrice} // Truyền thêm prop này
      />
    </>
  );
}

CouponSelector.propTypes = {
  selectedCoupons: PropTypes.object,
  setSelectedCoupons: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  checkedTotalPrice: PropTypes.number, // Thêm propType
};

export default CouponSelector;
