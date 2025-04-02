import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useLazyGetUserTotalOrderQuery } from "../../redux/api/checkoutSlice";

function ProfileDashBoard() {
  const [time, setTime] = useState("year");
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [triggerGetTotalOrder, { data, isLoading }] =
    useLazyGetUserTotalOrderQuery();

  useEffect(() => {
    triggerGetTotalOrder({ time });
  }, [time, triggerGetTotalOrder]);

  useEffect(() => {
    if (data) {
      setTotalOrders(data.totalOrders || 0);
      setTotalProducts(data.totalProducts || 0);
      setTotalAmount(data.totalAmountSpent || 0);
    }
  }, [data]);

  return (
    <Box maxHeight={500} overflow={"hidden"}>
      <Container>
        <Box mt={2} maxWidth={"200px"}>
          <FormControl fullWidth>
            <InputLabel
              shrink
              id="order-time-filter-label"
              sx={{ color: "black !important" }}
            >
              Filter by Order Time
            </InputLabel>
            <Select
              labelId="order-time-filter-label"
              id="order-time-filter"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              label="Filter by Order Time"
              sx={{
                color: "black",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "black",
                },
                "& .MuiSvgIcon-root": {
                  color: "black",
                },
              }}
            >
              <MenuItem value="year" sx={{ color: "black" }}>
                Year
              </MenuItem>
              <MenuItem value="month" sx={{ color: "black" }}>
                Month
              </MenuItem>
              <MenuItem value="day" sx={{ color: "black" }}>
                Day
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          minHeight="calc(100vh - 320px)"
          display={"flex"}
          gap={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Box
            display={"flex"}
            gap={1}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <CardMedia
              component="img"
              sx={{
                width: "50%",
                objectFit: "cover",
              }}
              alt="product image"
              image={"/Assets/order-number.png"}
              loading="lazy"
            />
            <Typography variant={"h6"}>Total Orders Placed</Typography>
            <Typography variant={"h6"}>
              {isLoading ? "Loading..." : totalOrders}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            gap={1}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <CardMedia
              component="img"
              sx={{
                width: "50%",
                objectFit: "cover",
              }}
              alt="product image"
              image={"/Assets/product-number.png"}
              loading="lazy"
            />
            <Typography variant={"h6"}>Total Products Ordered</Typography>
            <Typography variant={"h6"}>
              {isLoading ? "Loading..." : totalProducts}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            gap={1}
            alignItems={"center"}
            flexDirection={"column"}
          >
            <CardMedia
              component="img"
              sx={{
                width: "50%",
                objectFit: "cover",
              }}
              alt="product image"
              image={"/Assets/amount.png"}
              loading="lazy"
            />
            <Typography variant={"h6"}>Total Amount Spent</Typography>
            <Typography variant={"h6"}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalAmount || 0)}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default ProfileDashBoard;
