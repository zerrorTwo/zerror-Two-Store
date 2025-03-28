import Checkbox from "@mui/material/Checkbox";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CartDetailItem from "../components/Cart/CartDetailItem";
import {
  useGetAllCartQuery,
  useUpdateAllCheckoutMutation,
} from "../redux/api/cartSlice";
import CartEmpty from "../components/Cart/CartEmpty";
import { toast } from "react-toastify";
import { useCallback, useEffect, useMemo, useRef, useState } from "react"; // Xóa useState không cần thiết
import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid2";
import CouponSelector from "../components/Coupon/CouponSelector";
import { useDispatch, useSelector } from "react-redux";
import { selectCoupons, setCoupons } from "../redux/features/couponSlice";

function Cart() {
  const { data, refetch } = useGetAllCartQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedCoupons = useSelector(selectCoupons);
  const [updateAllCheckout, { isLoading }] = useUpdateAllCheckoutMutation();

  const [allChecked, setAllChecked] = useState(false);
  const checkedTotalPriceRef = useRef(0);
  const checkedProductIdsRef = useRef([]);
  const shippingFee = 30000;

  const hasCheckedItems = useMemo(() => {
    if (!data?.products?.length) return false;
    return data.products.some((product) =>
      product.cartVariations.some((variation) => variation.checkout)
    );
  }, [data]);

  const { checkedTotalPrice, checkedTotalItems, checkedProductIds } =
    useMemo(() => {
      if (!data?.products?.length)
        return {
          checkedTotalPrice: 0,
          checkedTotalItems: 0,
          checkedProductIds: [],
        };

      let totalPrice = 0;
      let totalItems = 0;
      const productIds = [];

      data.products.forEach((product) => {
        product.cartVariations.forEach((variation) => {
          if (variation.checkout) {
            const itemPrice = variation.price || product.price;
            totalPrice += itemPrice * variation.quantity;
            totalItems += variation.quantity;
            if (!productIds.includes(product.productId)) {
              productIds.push(product.productId);
            }
          }
        });
      });

      return {
        checkedTotalPrice: totalPrice,
        checkedTotalItems: totalItems,
        checkedProductIds: productIds,
      };
    }, [data]);

  const isCouponApplicable = useCallback(
    (coupon) => {
      if (!coupon) return false;
      if (checkedTotalPrice < coupon.min_value) return false;
      if (coupon.target_type === "PRODUCT" && coupon.target_ids) {
        return coupon.target_ids.some((id) => checkedProductIds.includes(id));
      }
      return true;
    },
    [checkedTotalPrice, checkedProductIds]
  );

  const getCouponInapplicabilityMessage = useCallback(
    (coupon) => {
      if (checkedTotalPrice < coupon.min_value) {
        const requiredPrice = coupon.min_value - checkedTotalPrice;
        return `Coupon "${
          coupon.code
        }" không còn áp dụng được, cần thêm ${new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(requiredPrice)} để áp dụng.`;
      }
      if (coupon.target_type === "PRODUCT" && coupon.target_ids) {
        return `Coupon "${coupon.code}" không còn áp dụng được vì không có sản phẩm tương ứng được chọn.`;
      }
      return `Coupon "${coupon.code}" không còn áp dụng được.`;
    },
    [checkedTotalPrice]
  );

  useEffect(() => {
    // Kiểm tra khi tổng giá trị hoặc danh sách sản phẩm thay đổi
    const previousPrice = checkedTotalPriceRef.current;
    const previousProductIds = checkedProductIdsRef.current;
    const updatedCoupons = { ...selectedCoupons };
    let hasChanges = false;

    if (
      previousPrice > checkedTotalPrice || // Giá giảm do uncheck
      JSON.stringify(previousProductIds) !== JSON.stringify(checkedProductIds) // Danh sách sản phẩm thay đổi
    ) {
      Object.keys(selectedCoupons).forEach((type) => {
        const coupon = selectedCoupons[type];
        if (coupon && !isCouponApplicable(coupon)) {
          updatedCoupons[type] = null;
          hasChanges = true;
          toast.warning(getCouponInapplicabilityMessage(coupon));
        }
      });

      if (hasChanges) {
        dispatch(setCoupons(updatedCoupons));
      }
    }

    // Cập nhật ref
    checkedTotalPriceRef.current = checkedTotalPrice;
    checkedProductIdsRef.current = checkedProductIds;
  }, [
    checkedTotalPrice,
    checkedProductIds,
    selectedCoupons,
    dispatch,
    isCouponApplicable,
    getCouponInapplicabilityMessage,
  ]);

  const calculateCouponDiscount = useMemo(() => {
    return (coupon) => {
      if (!coupon || !checkedTotalPrice || !isCouponApplicable(coupon))
        return 0;

      if (coupon.target_type === "FREESHIPPING") {
        const discount =
          coupon.type === "PERCENT"
            ? (shippingFee * coupon.value) / 100
            : coupon.value;
        return Math.min(discount, shippingFee);
      } else {
        const discount =
          coupon.type === "PERCENT"
            ? (checkedTotalPrice * coupon.value) / 100
            : coupon.value;
        return coupon.max_value && discount > coupon.max_value
          ? coupon.max_value
          : discount;
      }
    };
  }, [checkedTotalPrice, isCouponApplicable]);

  const calculateTotalDiscount = useMemo(() => {
    const coupons = Object.values(selectedCoupons).filter(Boolean);
    return coupons.reduce(
      (total, coupon) => total + calculateCouponDiscount(coupon),
      0
    );
  }, [selectedCoupons, calculateCouponDiscount]);

  const formattedTotalDiscount = useMemo(() => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(calculateTotalDiscount);
  }, [calculateTotalDiscount]);

  const finalTotal = useMemo(() => {
    if (!checkedTotalPrice) return 0;
    const productDiscount = Object.values(selectedCoupons)
      .filter(
        (coupon) =>
          coupon &&
          coupon.target_type !== "FREESHIPPING" &&
          isCouponApplicable(coupon)
      )
      .reduce((total, coupon) => total + calculateCouponDiscount(coupon), 0);
    const shippingDiscount =
      selectedCoupons.FREESHIPPING &&
      isCouponApplicable(selectedCoupons.FREESHIPPING)
        ? calculateCouponDiscount(selectedCoupons.FREESHIPPING)
        : 0;
    const totalBeforeShipping = Math.max(
      0,
      checkedTotalPrice - productDiscount
    );
    return totalBeforeShipping + shippingFee - shippingDiscount;
  }, [
    checkedTotalPrice,
    selectedCoupons,
    isCouponApplicable,
    calculateCouponDiscount,
  ]);

  useEffect(() => {
    if (data?.products?.length) {
      const isAllChecked = data.products.every((product) =>
        product.cartVariations.every((variation) => variation.checkout)
      );
      setAllChecked(isAllChecked);
    }
  }, [data]);

  const handleSelectAll = async (isChecked) => {
    try {
      await updateAllCheckout({ checkoutState: isChecked }).unwrap();
      refetch();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái giỏ hàng:", error);
      toast.error("Không thể cập nhật trạng thái giỏ hàng.");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: { selectedCoupons, finalTotal, shippingFee },
    });
  };

  const handleSetSelectedCoupons = (coupons) => {
    dispatch(setCoupons(coupons));
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Your Shopping Cart
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 8.5 }}>
          <Box display={"flex"} flexDirection={"column"} gap={2} mb={5}>
            <Box
              sx={{
                display: data?.products?.length === 0 ? "none" : "block",
                border: "1px solid silver",
                p: 1.5,
                borderRadius: 1,
                boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px",
              }}
            >
              <Grid2 container sx={{ alignItems: "center" }}>
                <Grid2 size={{ xs: 6 }}>
                  <Box display={"flex"} alignItems={"center"} gap={0}>
                    <Checkbox
                      checked={allChecked}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      sx={{ "&.Mui-checked": { color: "secondary.main" } }}
                    />
                    <Typography variant="body1">Product</Typography>
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 6 }}>
                  <Grid2 container>
                    <Grid2 size={{ xs: 4 }} textAlign={"center"}>
                      <Typography variant="body1">Unit Price</Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 5 }} textAlign={"center"}>
                      <Typography variant="body1">Quantity</Typography>
                    </Grid2>
                    <Grid2 size={{ xs: 3 }} textAlign={"center"}>
                      <Typography variant="body1">Actions</Typography>
                    </Grid2>
                  </Grid2>
                </Grid2>
              </Grid2>
            </Box>

            {data?.products?.length === 0 ? (
              <CartEmpty />
            ) : (
              data?.products?.map((product) =>
                product?.cartVariations?.map((variation, index) => (
                  <CartDetailItem
                    key={`${product.productId}-${index}`}
                    productId={product?.productId}
                    productName={product?.productName}
                    productPrice={product?.price}
                    productSlug={product?.productSlug}
                    productImages={product?.productImages}
                    checkout={variation?.checkout}
                    variation={variation}
                    allVariations={product?.productVariations}
                    refetch={refetch}
                  />
                ))
              )
            )}
          </Box>
        </Grid2>

        <Grid2 size={{ xs: 3.5 }}>
          <Box
            sx={{
              p: 1,
              py: 3,
              borderRadius: 1,
              position: "sticky",
              top: "96px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px",
            }}
          >
            <CouponSelector
              finalTotal={finalTotal}
              checkedTotalPrice={checkedTotalPrice}
              selectedCoupons={selectedCoupons}
              setSelectedCoupons={handleSetSelectedCoupons}
            />

            <Divider sx={{ my: 2 }} />
            <Box display="flex" flexDirection="column" gap={2}>
              {/* Tiền hàng */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1">
                  Tiền hàng ({checkedTotalItems || 0} sản phẩm):
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(checkedTotalPrice)}
                </Typography>
              </Box>

              {/* Phí vận chuyển */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1">Phí vận chuyển:</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(shippingFee)}
                </Typography>
              </Box>

              {/* Giảm giá */}
              {calculateTotalDiscount > 0 && (
                <Box display="flex" flexDirection="column" gap={1}>
                  {Object.values(selectedCoupons)
                    .filter(Boolean)
                    .map((coupon) => (
                      <Box
                        key={coupon._id}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <Typography
                          variant="body1"
                          color="secondary.main"
                          fontWeight={500}
                        >
                          {coupon.code}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="secondary.main"
                          fontWeight={500}
                        >
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(-coupon.value)}
                        </Typography>
                      </Box>
                    ))}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="body1"
                      color="secondary.main"
                      fontWeight={600}
                    >
                      Tổng giảm giá:
                    </Typography>
                    <Typography
                      variant="body1"
                      color="secondary.main"
                      fontWeight={600}
                    >
                      -{formattedTotalDiscount}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              {/* Tổng thanh toán */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1" fontWeight={600}>
                  Tổng thanh toán:
                </Typography>
                <Typography
                  variant="h6"
                  color="secondary.main"
                  fontWeight={700}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(finalTotal)}
                </Typography>
              </Box>

              {/* Nút Check Out */}
              <Button
                disabled={!hasCheckedItems}
                onClick={handleCheckout}
                sx={{
                  boxShadow: "none",
                  bgcolor: "secondary.main",
                  color: "white",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "secondary.dark" },
                  "&:disabled": { bgcolor: "grey.300", color: "grey.500" },
                }}
                fullWidth
                variant="contained"
              >
                Check Out
              </Button>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
      <Backdrop sx={{ color: "#fff", zIndex: 9999 }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}

export default Cart;
