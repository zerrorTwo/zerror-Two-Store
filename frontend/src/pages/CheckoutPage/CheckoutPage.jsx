import {
  Button,
  Container,
  Divider,
  Grid2,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material"; // Import Backdrop and CircularProgress
import Box from "@mui/material/Box";
import { useEffect, useState, useMemo } from "react";
import AddressDrawer from "./AddressDrawer";
import CheckoutProduct from "./CheckoutProduct";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import {
  useCreateOrderMutation,
  useGetProductCheckoutQuery,
} from "../../redux/api/checkoutSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useLazyGetUserAddressByIdQuery } from "../../redux/api/addressSlice";
import CashPaymentMethod from "./CashPaymentMethod";
import MomoPaymentMethod from "./MomoPaymentMethod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

function CheckoutPage() {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [confirmAddress, setConfirmAddress] = useState("");
  const userId = useSelector(selectCurrentUser)?._id;
  const { data } = useGetProductCheckoutQuery(userId);
  const [getUserAddressById] = useLazyGetUserAddressByIdQuery();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
  const navigate = useNavigate();

  const [createOrder, { isLoading }] = useCreateOrderMutation();


  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await getUserAddressById(confirmAddress).unwrap();
        setSelectedAddress(response);
      } catch (error) {
        console.error("Error fetching address:", error);
        toast.error("Failed to fetch address.");
      }
    };

    if (confirmAddress) {
      fetchUserAddress();
    }
  }, [confirmAddress, getUserAddressById]);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const handleSubmit = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    const data = {
      addressId: selectedAddress._id,
      paymentMethod: selectedPaymentMethod.toUpperCase(),
      notes: "Giao hàng vào buổi sáng.",
    };

    try {
      const success = await createOrder(data).unwrap();
      if (success) {
        navigate("/profile/my-order");
      } else {
        toast.error(
          success?.data?.message || "An error occurred while placing the order."
        );
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "An error occurred while placing the order."
      );
    }
  };

  const formatAddress = (address) => {
    if (!address) return "No address selected";
    return `${address.name} (+84) ${address.phone}, ${address.street}, ${address.ward?.name}, ${address.district?.name}, ${address.city?.name}`;
  };

  const formattedTotalPrice = useMemo(() => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(data?.totalPrice + 30000);
  }, [data?.totalPrice]);

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
                  setConfirmAddress={setConfirmAddress}
                />
              </Box>
              <Divider sx={{ my: 1 }} flexItem />
              <Box>
                <Typography alignItems={"center"} variant="body1">
                  {formatAddress(selectedAddress)}
                </Typography>
              </Box>
            </Box>

            {data?.products?.map((product) =>
              product?.cartVariations?.map((variation, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid silver",
                    p: 2,
                    borderRadius: 1,
                    boxShadow:
                      "rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px",
                  }}
                >
                  <CheckoutProduct
                    name={product?.productName}
                    img={product?.productImages}
                    price={product?.price}
                    item={variation}
                  />
                </Box>
              ))
            )}
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
                <Typography fontWeight={"bold"} variant="body1">
                  Select payment method
                </Typography>
              </Box>
              <CashPaymentMethod
                selectedMethod={selectedPaymentMethod}
                setSelectedMethod={setSelectedPaymentMethod}
              />
              <MomoPaymentMethod
                selectedMethod={selectedPaymentMethod}
                setSelectedMethod={setSelectedPaymentMethod}
              />

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
              <Box
                display="flex"
                flexDirection={"row"}
                gap={1}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography variant="body1">
                  Subtotal ({data?.totalItems} item):
                </Typography>
                <Typography variant="body1" sx={{ color: "black" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(data?.totalPrice)}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection={"row"}
                gap={1}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography variant="body1">Delivery fee:</Typography>
                <Typography variant="body1" sx={{ color: "black" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(30000)}
                </Typography>
              </Box>
              <Box
                display="flex"
                flexDirection={"row"}
                gap={1}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography variant="body1">Coupon: </Typography>
                <Typography variant="body1" sx={{ color: "black" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(0)}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                justifyContent={"space-between"}
              >
                <Typography variant="body1">
                  Total ({data?.totalItems} item):
                </Typography>
                <Typography variant="h6" sx={{ color: "secondary.main" }}>
                  {formattedTotalPrice}
                </Typography>
              </Box>
              <Button
                onClick={handleSubmit}
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}

export default CheckoutPage;
