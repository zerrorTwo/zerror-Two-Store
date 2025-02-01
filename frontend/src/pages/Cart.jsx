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

function Cart() {
  return (
    <Container>
      <Box display={"flex"} flexDirection={"column"} gap={2} mb={2}>
        {/* Cart Header */}
        <Box sx={{ p: 1, bgcolor: "text.hover" }}>
          <Grid2 container sx={{ alignItems: "center" }}>
            <Grid2 size={6}>
              <Box display={"flex"} alignItems={"center"} gap={0}>
                <Checkbox
                  sx={{
                    color: "text.primary", // Unchecked color
                    "&.Mui-checked": {
                      color: "secondary.main", // Checked color
                    },
                  }}
                />
                <Typography variant="body1">Product</Typography>
              </Box>
            </Grid2>
            <Grid2 size={6}>
              <Grid2 container>
                <Grid2 size={4} textAlign={"center"}>
                  <Typography sx={{ color: "text.primary" }} variant="body1">
                    Unit Price
                  </Typography>
                </Grid2>
                <Grid2 size={3} textAlign={"center"}>
                  <Typography sx={{ color: "text.primary" }} variant="body1">
                    Quantity
                  </Typography>
                </Grid2>
                <Grid2 size={3} textAlign={"center"}>
                  <Typography sx={{ color: "text.primary" }} variant="body1">
                    Total Price
                  </Typography>
                </Grid2>
                <Grid2 size={2} textAlign={"center"}>
                  <Typography sx={{ color: "text.primary" }} variant="body1">
                    Actions
                  </Typography>
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </Box>

        {/* Cart Content */}
        <Box sx={{ p: 1, bgcolor: "text.hover" }}>
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <CartDetailItem />
            <Divider />
            <CartDetailItem />
            <Divider />
            <CartDetailItem />
            <Divider />
            <CartDetailItem />
            <Divider />
            <CartDetailItem />
            <Divider />
            <CartDetailItem />
          </Box>
        </Box>

        {/* Cart Footer */}
        <Box
          sx={{
            p: 1,
            bgcolor: "text.hover",
            pt: 2,
            position: "sticky",
            bottom: 0,
            boxShadow:
              " rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
          }}
        >
          <Box
            display={"flex"}
            justifyContent={"flex-end"}
            gap={20}
            alignItems={"center"}
            mx={5}
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
          <Divider sx={{ mt: 2 }} />
          <Box
            display={"flex"}
            alignItems={"center"}
            sx={{ mt: 2 }}
            justifyContent={"space-between"}
            mr={5}
          >
            <Box display={"flex"} alignItems={"center"}>
              <Checkbox
                sx={{
                  color: "text.primary", // Unchecked color
                  "&.Mui-checked": {
                    color: "secondary.main", // Checked color
                  },
                }}
              />
              <Typography variant="body1">Select All (3)</Typography>
              <Typography sx={{ cursor: "pointer", ml: 1 }} variant="body1">
                Delete
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"} gap={2}>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <Typography variant="body1">Total (0 item):</Typography>
                <Typography variant="h6" sx={{ color: "secondary.main" }}>
                  {new Intl.NumberFormat("en-US").format(1000000)}đ
                </Typography>
              </Box>
              <Button
                sx={{
                  boxShadow: "none",
                  bgcolor: "secondary.main",
                  color: "white",
                  px: 5,
                }}
                variant="contained"
              >
                Check out
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Cart;
