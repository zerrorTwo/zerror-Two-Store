import Checkbox from "@mui/material/Checkbox";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid2,
  Typography,
} from "@mui/material";
import CartDetailItem from "../components/Cart/CartDetailItem";
import { useGetAllCartQuery } from "../redux/api/cartSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { useState } from "react";

function Cart() {
  const [selected, setSelected] = useState([]);
  const userId = useSelector(selectCurrentUser)?._id;
  const { data } = useGetAllCartQuery(userId);
  console.log(data);

  const handleSelectItem = (itemId, isChecked) => {
    setSelected(
      (prev) =>
        isChecked
          ? [...prev, itemId] // Thêm nếu được check
          : prev.filter((id) => id !== itemId) // Xóa nếu bỏ check
    );
  };

  const allChecked = selected?.length === data?.totalItems;

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      // Chọn tất cả các item
      const allItemIds = data?.products.flatMap((product) =>
        product?.cartVariations?.map(
          (variation) => `${product.productSlug}-${variation.type}`
        )
      );
      setSelected(allItemIds);
    } else {
      // Bỏ chọn tất cả các item
      setSelected([]);
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
                p: 1,
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
                        color: "text.primary", // Unchecked color
                        "&.Mui-checked": {
                          color: "secondary.main", // Checked color
                        },
                      }}
                    />
                    <Typography variant="body1">
                      Product ({selected?.length})
                    </Typography>
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
                    {/* <Grid2 size={3} textAlign={"center"}>
                      <Typography
                        sx={{ color: "text.secondary" }}
                        variant="body1"
                      >
                        Total Price
                      </Typography>
                    </Grid2> */}
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

            {/* Cart Content */}
            {data?.products?.map((product) =>
              product?.cartVariations?.map((variation, index) => (
                <CartDetailItem
                  key={`${product.productSlug}-${index}`}
                  productName={product.productName}
                  productSlug={product.productSlug}
                  productImages={product.productImages}
                  variation={variation}
                  selected={selected}
                  onSelect={handleSelectItem}
                  allVariations={product?.productVariations}
                />
              ))
            )}
          </Box>
        </Grid2>

        <Grid2 size={3.5}>
          {/* Cart Footer */}
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
                <Typography variant="body1">Total (0 item):</Typography>
                <Typography variant="h6" sx={{ color: "secondary.main" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(1000000)}
                </Typography>
              </Box>
              <Button
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
    </Container>
  );
}

export default Cart;
