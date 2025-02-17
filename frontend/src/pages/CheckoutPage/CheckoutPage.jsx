import { Button, Container, Divider, Grid2, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useState } from "react";
import AddressDrawer from "./AddressDrawer";
import CheckoutProduct from "./CheckoutProduct";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import PaymentMethod from "./PaymentMethod";

function CheckoutPage() {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Confirm - payment
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={8.5}>
          <Box display="flex" flexDirection="column" gap={2} mb={5}>
            <Box
              sx={{
                border: "1px solid silver",
                p: 2,
                borderRadius: 1,
                boxShadow:
                  " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={0.5}
                >
                  <AddLocationIcon color="secondary" />
                  <Typography
                    color="secondary"
                    alignItems={"center"}
                    variant="body1"
                  >
                    Delivery Address
                  </Typography>
                </Box>
                <Typography
                  sx={{ cursor: "pointer", color: "#05a" }}
                  variant="body1"
                  onClick={toggleDrawer("right", true)}
                >
                  Edit
                </Typography>

                <AddressDrawer
                  anchor="right"
                  state={state}
                  toggleDrawer={toggleDrawer}
                />
              </Box>
              <Divider sx={{ my: 1 }} flexItem />
              <Box>
                <Typography alignItems={"center"} variant="body1">
                  Lê Quốc Nam (+84) 372364243 Nhà văn hoá khu phố phú Xuân, Thị
                  Trấn Phú Long, Huyện Hàm Thuận Bắc, Bình Thuận
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                border: "1px solid silver",
                p: 2,
                borderRadius: 1,
                boxShadow:
                  " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
              }}
            >
              <CheckoutProduct />
            </Box>
            <Box
              sx={{
                border: "1px solid silver",
                p: 2,
                borderRadius: 1,
                boxShadow:
                  " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
              }}
            >
              <CheckoutProduct />
            </Box>
            <Box
              sx={{
                border: "1px solid silver",
                p: 2,
                borderRadius: 1,
                boxShadow:
                  " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
              }}
            >
              <CheckoutProduct />
            </Box>
            <Box
              sx={{
                border: "1px solid silver",
                p: 2,
                borderRadius: 1,
                boxShadow:
                  " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
              }}
            >
              <CheckoutProduct />
            </Box>
            <Box
              sx={{
                border: "1px solid silver",
                p: 2,
                borderRadius: 1,
                boxShadow:
                  " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
              }}
            >
              <CheckoutProduct />
            </Box>
          </Box>
        </Grid2>

        <Grid2 size={3.5}>
          <Box
            sx={{
              p: 2,
              py: 3,
              borderRadius: 1,
              position: "sticky",
              top: "96px",
              boxShadow:
                " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
            }}
          >
            <Box display="flex" flexDirection={"column"} gap={1}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1">Select payment method</Typography>

                <Typography
                  sx={{ color: "#05a", cursor: "pointer" }}
                  variant="body1"
                >
                  Change methods
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} flexItem />
              <PaymentMethod />
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1">Platform Voucher</Typography>
                <Typography
                  sx={{ color: "#05a", cursor: "pointer" }}
                  variant="body1"
                >
                  Select or enter code
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body1">Total (0 item):</Typography>
                <Typography variant="h6" sx={{ color: "secondary.main" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(100000)}
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
                Place Order
              </Button>
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default CheckoutPage;
