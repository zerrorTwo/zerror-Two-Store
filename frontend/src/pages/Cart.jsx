import Checkbox from "@mui/material/Checkbox";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid2,
  Typography,
} from "@mui/material";
import CartDetailItem from "../components/Cart/CartDetailItem";
import {
  useGetAllCartQuery,
  useUpdateAllCheckoutMutation,
} from "../redux/api/cartSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import CartEmpty from "../components/Cart/CartEmpty";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Cart() {
  const userId = useSelector(selectCurrentUser)?._id;
  const { data, refetch } = useGetAllCartQuery(userId);
  const navigate = useNavigate();
  const [updateAllCheckout, { isLoading }] = useUpdateAllCheckoutMutation(); // ✅ Dùng isLoading

  const [allChecked, setAllChecked] = useState(false);

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
        userId,
        checkoutState: isChecked,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái giỏ hàng:", error);
      toast.error("Không thể cập nhật trạng thái giỏ hàng.");
    }
  };
  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Your Shopping Cart ({data?.totalItems})
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={8.5}>
          <Box display={"flex"} flexDirection={"column"} gap={2} mb={5}>
            {/* Cart Header */}
            <Box
              sx={{
                border: "1px solid silver",
                p: 1.5,
                borderRadius: 1,
                boxShadow:
                  " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
              }}
            >
              <Grid2 container sx={{ alignItems: "center" }}>
                <Grid2 size={6}>
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
                <Grid2 size={6}>
                  <Grid2 container>
                    <Grid2 size={4} textAlign={"center"}>
                      <Typography
                        sx={{ color: "text.secondary" }}
                        variant="body1"
                      >
                        Unit Price
                      </Typography>
                    </Grid2>
                    <Grid2 size={5} textAlign={"center"}>
                      <Typography
                        sx={{ color: "text.secondary" }}
                        variant="body1"
                      >
                        Quantity
                      </Typography>
                    </Grid2>
                    <Grid2 size={3} textAlign={"center"}>
                      <Typography
                        sx={{ color: "text.secondary" }}
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

        <Grid2 size={3.5}>
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
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography sx={{ color: "text.blackColor" }} variant="body1">
                Platform Voucher
              </Typography>
              <Typography
                sx={{ color: "#05a", cursor: "pointer" }}
                variant="body1"
              >
                Select or enter code
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box display={"flex"} flexDirection={"column"} gap={2}>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <Typography variant="body1">
                  Total ({data?.totalItems || 0} items):
                </Typography>
                <Typography variant="h6" sx={{ color: "secondary.main" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(data?.totalPrice || 0)}
                </Typography>
              </Box>
              <Button
                onClick={() => navigate("/checkout")}
                sx={{
                  boxShadow: "none",
                  bgcolor: "secondary.main",
                  color: "white",
                  px: 5,
                }}
                fullWidth
                variant="contained"
              >
                Check out
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
