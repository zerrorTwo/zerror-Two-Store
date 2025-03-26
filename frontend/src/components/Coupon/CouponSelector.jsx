import { useState } from 'react';
import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CouponPopover from './CouponPopover';

function CouponSelector({ selectedCoupon, setSelectedCoupon, selectedCoupons, setSelectedCoupons }) {
  const [couponAnchorEl, setCouponAnchorEl] = useState(null);

  const handleCouponPopoverOpen = (event) => {
    setCouponAnchorEl(event.currentTarget);
  };

  const handleCouponPopoverClose = () => {
    setCouponAnchorEl(null);
  };

  // Lấy tất cả các coupon đã chọn
  const activeCoupons = selectedCoupons 
    ? Object.values(selectedCoupons).filter(Boolean) 
    : (selectedCoupon ? [selectedCoupon] : []);

  return (
    <>
      <Box 
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Typography variant="body1">Platform Voucher</Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            color: activeCoupons.length > 0 ? 'secondary.main' : '#05a',
          }}
        >
          {activeCoupons.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {activeCoupons.map(coupon => (
                <Chip 
                  key={coupon._id}
                  label={coupon.code} 
                  size="small"
                  sx={{ 
                    bgcolor: coupon.target_type === 'PRODUCT' 
                      ? 'rgba(255, 0, 127, 0.1)' 
                      : coupon.target_type === 'FREESHIPPING' 
                        ? 'rgba(0, 127, 255, 0.1)' 
                        : 'rgba(255, 127, 0, 0.1)',
                    color: coupon.target_type === 'PRODUCT' 
                      ? 'secondary.main' 
                      : coupon.target_type === 'FREESHIPPING' 
                        ? 'primary.main' 
                        : 'warning.main',
                    borderColor: coupon.target_type === 'PRODUCT' 
                      ? 'secondary.main' 
                      : coupon.target_type === 'FREESHIPPING' 
                        ? 'primary.main' 
                        : 'warning.main',
                    borderWidth: 1,
                    borderStyle: 'solid'
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography 
              variant="body2" 
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={handleCouponPopoverOpen}
            >
              Chọn hoặc nhập mã
            </Typography>
          )}
          <Typography 
            variant="body2" 
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={handleCouponPopoverOpen}
          >
            {activeCoupons.length > 0 ? 'Thay đổi' : ''}
          </Typography>
        </Box>
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
    target_type: PropTypes.string
  }),
  setSelectedCoupon: PropTypes.func.isRequired,
  selectedCoupons: PropTypes.object,
  setSelectedCoupons: PropTypes.func
};

export default CouponSelector;
