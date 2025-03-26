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
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import Grid2  from "@mui/material/Grid2";
import CouponSelector from "../components/Coupon/CouponSelector";

function Cart() {
  const { data, refetch } = useGetAllCartQuery();
  const navigate = useNavigate();
  const [updateAllCheckout, { isLoading }] = useUpdateAllCheckoutMutation();

  const [allChecked, setAllChecked] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedCoupons, setSelectedCoupons] = useState({
    PRODUCT: null,
    FREESHIPPING: null,
    ORDER: null
  });
  
  // Kiểm tra xem có bất kỳ sản phẩm nào được check không
  const hasCheckedItems = useMemo(() => {
    if (!data?.products?.length) return false;
    
    return data.products.some(product => 
      product.cartVariations.some(variation => variation.checkout)
    );
  }, [data]);

  // Tính tổng giá và số lượng cho các sản phẩm đã được checked
  const { checkedTotalPrice, checkedTotalItems } = useMemo(() => {
    if (!data?.products?.length) return { checkedTotalPrice: 0, checkedTotalItems: 0 };
    
    let totalPrice = 0;
    let totalItems = 0;
    
    data.products.forEach(product => {
      product.cartVariations.forEach(variation => {
        if (variation.checkout) {
          // Sử dụng giá của biến thể nếu có, nếu không thì sử dụng giá của sản phẩm
          const itemPrice = variation.price || product.price;
          totalPrice += itemPrice * variation.quantity;
          totalItems += variation.quantity;
        }
      });
    });
    
    return { checkedTotalPrice: totalPrice, checkedTotalItems: totalItems };
  }, [data]);

  // Tính số tiền giảm giá dựa trên coupon được chọn
  const calculateCouponDiscount = useMemo(() => {
    return (coupon) => {
      if (!coupon || !checkedTotalPrice) return 0;
      
      if (coupon.type === "PERCENT") {
        const discount = (checkedTotalPrice * coupon.value) / 100;
        return coupon.max_value && discount > coupon.max_value 
          ? coupon.max_value 
          : discount;
      } else {
        return coupon.value;
      }
    };
  }, [checkedTotalPrice]);
  
  // Tính tổng số tiền giảm giá từ tất cả các coupon
  const calculateTotalDiscount = useMemo(() => {
    const coupons = Object.values(selectedCoupons).filter(Boolean);
    return coupons.reduce((total, coupon) => total + calculateCouponDiscount(coupon), 0);
  }, [selectedCoupons, calculateCouponDiscount]);
  
  // Format tổng số tiền giảm giá
  const formattedTotalDiscount = useMemo(() => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(calculateTotalDiscount);
  }, [calculateTotalDiscount]);
  
  // Tính tổng tiền sau khi áp dụng giảm giá
  const finalTotal = useMemo(() => {
    return Math.max(0, checkedTotalPrice - calculateTotalDiscount);
  }, [checkedTotalPrice, calculateTotalDiscount]);

  // Update selectedCoupons when selectedCoupon changes (for backward compatibility)
  useEffect(() => {
    if (selectedCoupon) {
      const type = selectedCoupon.target_type || 'ORDER';
      setSelectedCoupons(prev => ({
        ...prev,
        [type]: selectedCoupon
      }));
    }
  }, [selectedCoupon]);

  // Update selectedCoupon when selectedCoupons changes (for backward compatibility)
  useEffect(() => {
    const coupons = Object.values(selectedCoupons).filter(Boolean);
    if (coupons.length > 0) {
      setSelectedCoupon(coupons[0]);
    } else {
      setSelectedCoupon(null);
    }
  }, [selectedCoupons]);
  
  // Cập nhật trạng thái "Select All" dựa vào dữ liệu giỏ hàng
  useEffect(() => {
    if (data?.products?.length) {
      const isAllChecked = data.products.every((product) =>
        product.cartVariations.every((variation) => variation.checkout)
      );
      setAllChecked(isAllChecked);
    }
  }, [data]);

  // Hàm xử lý chọn/bỏ chọn tất cả sản phẩm
  const handleSelectAll = async (isChecked) => {
    try {
      await updateAllCheckout({
        checkoutState: isChecked,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái giỏ hàng:", error);
      toast.error("Không thể cập nhật trạng thái giỏ hàng.");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Your Shopping Cart
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={{xs: 8.5}}>
          <Box display={"flex"} flexDirection={"column"} gap={2} mb={5}>
            {/* Cart Header */}
            <Box
              sx={{
                display: data?.products?.length === 0 ? "none" : "block",
                border: "1px solid silver",
                p: 1.5,
                borderRadius: 1,
                boxShadow:
                  " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
              }}
            >
              <Grid2 container sx={{ alignItems: "center" }}>
                <Grid2 size={{xs: 6}}>
                  <Box display={"flex"} alignItems={"center"} gap={0}>
                    <Checkbox
                      checked={allChecked}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      sx={{
                        color: "text.primary",
                        "&.Mui-checked": {
                          color: "secondary.main",
                        },
                      }}
                    />
                    <Typography variant="body1">Product</Typography>
                  </Box>
                </Grid2>
                <Grid2 size={{xs: 6}}>
                  <Grid2 container>
                    <Grid2 size={{xs: 4}} textAlign={"center"}>
                      <Typography
                        variant="body1"
                      >
                        Unit Price
                      </Typography>
                    </Grid2>
                    <Grid2 size={{xs: 5}} textAlign={"center"}>
                      <Typography
                        variant="body1"
                      >
                        Quantity
                      </Typography>
                    </Grid2>
                    <Grid2 size={{xs: 3}} textAlign={"center"}>
                      <Typography
                        variant="body1"
                      >
                        Actions
                      </Typography>
                    </Grid2>
                  </Grid2>
                </Grid2>
              </Grid2>
            </Box>

            {data?.products?.length === 0 ? (
              <CartEmpty />
            ) : (
              <>
                {data?.products?.map((product) =>
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
                )}
              </>
            )}
          </Box>
        </Grid2>

        <Grid2 size={{xs: 3.5}}>
          <Box
            sx={{
              p: 1,
              py: 3,
              borderRadius: 1,
              position: "sticky",
              top: "96px",
              boxShadow:
                " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
            }}
          >

              <CouponSelector 
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={setSelectedCoupon}
                selectedCoupons={selectedCoupons}
                setSelectedCoupons={setSelectedCoupons}
              />

            <Divider sx={{ my: 2 }} />

            <Box display={"flex"} flexDirection={"column"} gap={2}>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <Typography variant="body1">
                  Tổng ({checkedTotalItems || 0} sản phẩm):
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "secondary.main", fontWeight: "bold" }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(finalTotal)}
                </Typography>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: calculateTotalDiscount > 0 ? "secondary.main" : "inherit" }}>
                  Giảm giá{calculateTotalDiscount > 0 ? ` (${Object.values(selectedCoupons).filter(Boolean).map(c => c.code).join(', ')})` : ''}:
                </Typography>
                <Typography variant="body2" sx={{ color: calculateTotalDiscount > 0 ? "secondary.main" : "inherit" }}>
                  {calculateTotalDiscount > 0 ? '-' : ''}{formattedTotalDiscount}
                </Typography>
              </Box>
              
              <Button
                disabled={!hasCheckedItems}
                onClick={handleCheckout}
                sx={{
                  boxShadow: "none",
                  bgcolor: "secondary.main",
                  color: "white",
                  "&:disabled": {
                    bgcolor: "grey.300",
                    color: "grey.500",
                  },
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
