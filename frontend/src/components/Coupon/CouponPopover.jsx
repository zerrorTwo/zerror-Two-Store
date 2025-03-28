import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";

function CouponPopover({
  checkedTotalPrice,
  anchorEl,
  onClose,
  setSelectedCoupons,
  selectedCoupons: initialSelectedCoupons,
  availableCoupons,
  isLoadingCoupons,
}) {
  const [couponCode, setCouponCode] = useState("");

  const [localSelectedCoupons, setLocalSelectedCoupons] = useState({
    PRODUCT: null,
    FREESHIPPING: null,
    ORDER: null,
  });

  useEffect(() => {
    if (initialSelectedCoupons) {
      setLocalSelectedCoupons(initialSelectedCoupons);
    }
  }, [initialSelectedCoupons]);

  const handleCouponCodeChange = (e) => {
    setCouponCode(e.target.value);
  };

  const handleClearCode = () => {
    setCouponCode("");
  };

  const handleApplyCouponCode = () => {
    if (!couponCode.trim()) {
      toast.warning("Please enter a coupon code");
      return;
    }

    if (!availableCoupons) {
      toast.warning("Coupon data is not available");
      return;
    }

    const foundCoupon = availableCoupons.find(
      (coupon) => coupon.code.toLowerCase() === couponCode.trim().toLowerCase()
    );

    if (foundCoupon) {
      const type = foundCoupon.target_type || "ORDER";
      const selectedCount =
        Object.values(localSelectedCoupons).filter(Boolean).length;

      if (checkedTotalPrice < foundCoupon.min_value) {
        toast.warning(
          `Total price must be at least ${new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(foundCoupon.min_value)} to use this coupon`
        );
        return;
      }

      if (selectedCount >= 3 && !localSelectedCoupons[type]) {
        toast.warning("You can only select up to 3 coupons");
        return;
      }

      setLocalSelectedCoupons((prev) => ({
        ...prev,
        [type]: foundCoupon,
      }));
      setCouponCode("");
    } else {
      toast.warning("Coupon code not found in available coupons list");
    }
  };

  const handleCouponClick = (coupon) => {
    try {
      const type = coupon.target_type || "ORDER";
      const selectedCount =
        Object.values(localSelectedCoupons).filter(Boolean).length;

      if (checkedTotalPrice < coupon.min_value) {
        toast.warning(
          `Total price must be at least ${new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(coupon.min_value)} to use this coupon`
        );
        return;
      }

      if (localSelectedCoupons[type]?._id === coupon._id) {
        setLocalSelectedCoupons((prev) => ({
          ...prev,
          [type]: null,
        }));
        toast.info(`Coupon "${coupon.name}" removed`);
      } else if (selectedCount < 3 || localSelectedCoupons[type]) {
        setLocalSelectedCoupons((prev) => ({
          ...prev,
          [type]: coupon,
        }));
      } else {
        toast.warning("You can only select up to 3 coupons");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to apply coupon"
      );
    }
  };

  const handleDone = () => {
    setSelectedCoupons(localSelectedCoupons);
    onClose();
  };

  const groupedCoupons = useMemo(() => {
    if (!availableCoupons) return { PRODUCT: [], FREESHIPPING: [], ORDER: [] };
    const grouped = { PRODUCT: [], FREESHIPPING: [], ORDER: [] };
    availableCoupons.forEach((coupon) => {
      grouped[coupon.target_type || "ORDER"].push(coupon);
    });
    return grouped;
  }, [availableCoupons]);

  const filteredGroupedCoupons = useMemo(() => {
    if (!availableCoupons) return { PRODUCT: [], FREESHIPPING: [], ORDER: [] };
    const filtered = { PRODUCT: [], FREESHIPPING: [], ORDER: [] };
    Object.keys(groupedCoupons).forEach((type) => {
      filtered[type] = groupedCoupons[type];
    });
    return filtered;
  }, [availableCoupons, groupedCoupons]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getCouponValueText = (coupon) => {
    return coupon.type === "PERCENT"
      ? `${coupon.value}% (tối đa ${formatCurrency(coupon.max_value)})`
      : formatCurrency(coupon.value);
  };

  const getMinimumRequirementText = (coupon) => {
    return `Đơn tối thiểu ${formatCurrency(coupon.min_value)}`;
  };

  const getCouponTypeColor = (type) => {
    switch (type) {
      case "PRODUCT":
        return {
          light: "#FFF0F7",
          main: "#FFB6C1",
          dark: "#FF69B4",
          text: "#D81B60",
        };
      case "FREESHIPPING":
        return {
          light: "#E3F2FD",
          main: "#90CAF9",
          dark: "#1E88E5",
          text: "#1565C0",
        };
      case "ORDER":
      default:
        return {
          light: "#FFFDE7",
          main: "#FFF59D",
          dark: "#FBC02D",
          text: "#F57F17",
        };
    }
  };

  const getCouponTypeTitle = (type) => {
    switch (type) {
      case "PRODUCT":
        return "Mã giảm giá sản phẩm";
      case "FREESHIPPING":
        return "Mã miễn phí vận chuyển";
      case "ORDER":
      default:
        return "Mã giảm giá đơn hàng";
    }
  };

  return (
    <Popover
      anchorReference="anchorPosition"
      anchorPosition={{
        top: window.innerHeight / 2 - 300,
        left: window.innerWidth / 2,
      }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          width: 550,
          maxWidth: "90vw",
          maxHeight: "100vh",
        },
      }}
    >
      <Box sx={{ p: 0 }}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Chọn mã giảm giá</Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
            <ClearIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Nhập mã giảm giá..."
                value={couponCode}
                onChange={handleCouponCodeChange}
                InputProps={{
                  endAdornment: couponCode && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClearCode}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                onClick={handleApplyCouponCode}
                size="small"
                sx={{ whiteSpace: "nowrap" }}
              >
                Áp dụng
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              p: 1,
              bgcolor: "action.hover",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" fontWeight="500">
              Mã giảm giá có sẵn (
              {Object.values(filteredGroupedCoupons).reduce(
                (acc, coupons) => acc + coupons.length,
                0
              )}
              )
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ overflow: "auto", maxHeight: "60vh" }}>
            {isLoadingCoupons ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <>
                {Object.keys(filteredGroupedCoupons).map((type) => {
                  const coupons = filteredGroupedCoupons[type];
                  const colors = getCouponTypeColor(type);
                  if (coupons.length === 0) return null;

                  return (
                    <Box key={type} sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          p: 1,
                          mb: 1,
                          bgcolor: colors.main,
                          borderRadius: "4px 4px 0 0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", color: colors.text }}
                        >
                          {getCouponTypeTitle(type)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: colors.text }}
                        >
                          {coupons.length} mã
                        </Typography>
                      </Box>

                      {coupons.map((coupon) => {
                        const isDisabled = checkedTotalPrice < coupon.min_value; // Dùng checkedTotalPrice
                        return (
                          <Box
                            key={coupon._id}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              p: 2,
                              borderRadius: 1,
                              mb: 1,
                              border: "1px solid",
                              borderColor: isDisabled
                                ? "divider"
                                : localSelectedCoupons[type]?._id === coupon._id
                                ? colors.dark
                                : "divider",
                              bgcolor: isDisabled
                                ? "grey.200"
                                : localSelectedCoupons[type]?._id === coupon._id
                                ? colors.light
                                : "background.paper",
                              cursor: isDisabled ? "not-allowed" : "pointer",
                              "&:hover": {
                                borderColor: isDisabled
                                  ? "divider"
                                  : colors.dark,
                                bgcolor: isDisabled ? "grey.200" : colors.light,
                              },
                            }}
                            onClick={() =>
                              !isDisabled && handleCouponClick(coupon)
                            }
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 1,
                              }}
                            >
                              <Box>
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: "bold",
                                    color: isDisabled
                                      ? "text.disabled"
                                      : colors.text,
                                  }}
                                >
                                  {getCouponValueText(coupon)}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: "medium" }}
                                >
                                  {coupon.name}
                                </Typography>
                              </Box>
                              <Chip
                                label={coupon.code}
                                size="small"
                                sx={{
                                  borderColor: colors.dark,
                                  color: colors.text,
                                }}
                                variant="outlined"
                              />
                            </Box>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {getMinimumRequirementText(coupon)}
                            </Typography>
                            {coupon.description && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {coupon.description}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              HSD:{" "}
                              {new Date(coupon.end_day).toLocaleDateString(
                                "vi-VN"
                              )}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })}
                {Object.values(filteredGroupedCoupons).every(
                  (coupons) => coupons.length === 0
                ) && (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography color="text.secondary">
                      Không tìm thấy mã giảm giá
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Box>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              {Object.entries(localSelectedCoupons).map(([type, coupon]) => {
                if (!coupon) return null;
                const colors = getCouponTypeColor(type);
                return (
                  <Chip
                    key={type}
                    label={`${getCouponTypeTitle(type)}: ${coupon.code}`}
                    size="small"
                    sx={{
                      mr: 1,
                      mb: 1,
                      bgcolor: colors.light,
                      color: colors.text,
                      borderColor: colors.main,
                      "& .MuiChip-deleteIcon": {
                        color: colors.text,
                        "&:hover": { color: colors.dark },
                      },
                    }}
                    variant="outlined"
                    onDelete={() =>
                      setLocalSelectedCoupons((prev) => ({
                        ...prev,
                        [type]: null,
                      }))
                    }
                  />
                );
              })}
              {Object.values(localSelectedCoupons).every(
                (coupon) => !coupon
              ) && (
                <Typography variant="body2" color="text.secondary">
                  Chưa chọn mã giảm giá
                </Typography>
              )}
            </Box>
            <Button variant="contained" onClick={handleDone} size="small">
              Xong
            </Button>
          </Box>
        </Box>
      </Box>
    </Popover>
  );
}

CouponPopover.propTypes = {
  anchorEl: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  setSelectedCoupons: PropTypes.func.isRequired,
  selectedCoupons: PropTypes.object,
  finalTotal: PropTypes.number,
  checkedTotalPrice: PropTypes.number, // Thêm propType
  availableCoupons: PropTypes.array,
  isLoadingCoupons: PropTypes.bool,
};

export default CouponPopover;
