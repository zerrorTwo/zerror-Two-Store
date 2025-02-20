import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetAllCartQuery } from "../redux/api/cartSlice";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
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
import CartEmpty from "../components/Cart/CartEmpty";

function Cart() {
  const userId = useSelector(selectCurrentUser)?._id;
  const { data } = useGetAllCartQuery(userId);

  // Lấy danh sách đã chọn từ localStorage
  const storedSelected =
    JSON.parse(localStorage.getItem("selectedItems")) || [];
  const [selected, setSelected] = useState(
    storedSelected.map(
      (item) => `${item.productId}-${JSON.stringify(item?.variation?.type)}`
    )
  );

  // Cập nhật localStorage khi selected thay đổi
  useEffect(() => {
    const selectedProducts = selected
      .map((itemId) => {
        const [productId, variationType] = itemId.split("-");
        const product = data?.products.find((p) => p.productId === productId);
        const variation = product?.cartVariations.find(
          (v) => JSON.stringify(v?.type) === variationType
        );

        console.log(product);

        if (!product) return null;

        return {
          productId: product.productId,
          name: product.productName,
          slug: product.productSlug,
          images: product.productImages,
          price: variation?.price || product?.cartVariations[0]?.price,
          quantity: variation?.quantity || product?.cartVariations[0]?.quantity,
          variation: variation,
        };
      })
      .filter(Boolean); // Loại bỏ null

    localStorage.setItem("selectedItems", JSON.stringify(selectedProducts));
  }, [selected, data]);

  // Hàm chọn 1 sản phẩm
  const handleSelectItem = (itemId, isChecked) => {
    setSelected((prev) =>
      isChecked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    );
  };

  // Hàm chọn tất cả sản phẩm
  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allItems = data?.products.flatMap((product) =>
        product?.cartVariations?.map((variation) => {
          const itemId = `${product.productId}-${JSON.stringify(
            variation.type
          )}`;
          return {
            id: itemId,
            product: {
              productId: product.productId,
              name: product.productName,
              slug: product.productSlug,
              images: product.productImages,
              price: variation?.price || product?.cartVariations[0]?.price,
              quantity:
                variation?.quantity || product?.cartVariations[0]?.quantity,
              variation: variation,
            },
          };
        })
      );

      setSelected(allItems.map((item) => item.id));
      localStorage.setItem(
        "selectedItems",
        JSON.stringify(allItems.map((item) => item.product))
      );
    } else {
      setSelected([]);
      localStorage.removeItem("selectedItems");
    }
  };

  // Kiểm tra tất cả có được chọn không
  const allChecked =
    selected.length ===
    data?.products?.reduce(
      (total, product) => total + product.cartVariations.length,
      0
    );

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Your Shopping Cart ({data?.totalItems})
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={8.5}>
          <Box display={"flex"} flexDirection={"column"} gap={2} mb={5}>
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
                      productId={product.productId}
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
                <Typography variant="body1">Total (0 item):</Typography>
                <Typography variant="h6" sx={{ color: "secondary.main" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(data?.totalPrice)}
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
