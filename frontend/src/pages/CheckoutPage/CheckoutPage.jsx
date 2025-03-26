import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../../redux/api/checkoutSlice";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import { Grid } from "@mui/material"; 
import CouponSelector from "../../components/Coupon/CouponSelector";
import AddressDrawer from "./AddressDrawer";
import CheckoutProduct from "./CheckoutProduct";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import CashPaymentMethod from "./CashPaymentMethod";
import MomoPaymentMethod from "./MomoPaymentMethod";
import Backdrop from "@mui/material/Backdrop";
import {
  useGetProductCheckoutQuery,
} from "../../redux/api/checkoutSlice";
import { useLazyGetUserAddressByIdQuery } from "../../redux/api/addressSlice";

function CheckoutPage() {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [confirmAddress, setConfirmAddress] = useState("");
  const [getUserAddressById] = useLazyGetUserAddressByIdQuery();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedCoupons, setSelectedCoupons] = useState({
    PRODUCT: null,
    FREESHIPPING: null,
    ORDER: null
  });
  
  const navigate = useNavigate();

  const { data } = useGetProductCheckoutQuery();
  const [createOrder, { isLoading: loadingOrder }] = useCreateOrderMutation();

  const calculateCouponDiscount = useCallback((coupon) => {
    if (!coupon || !data?.totalPrice) return 0;
    
    if (coupon.type === "PERCENT") {
      const discount = (data.totalPrice * coupon.value) / 100;
      return coupon.max_value && discount > coupon.max_value 
        ? coupon.max_value 
        : discount;
    } else {
      return coupon.value;
    }
  }, [data]);
  
  const calculateTotalDiscount = useCallback(() => {
    const coupons = Object.values(selectedCoupons).filter(Boolean);
    return coupons.reduce((total, coupon) => total + calculateCouponDiscount(coupon), 0);
  }, [selectedCoupons, calculateCouponDiscount]);

  const totalDiscount = useMemo(() => {
    return calculateTotalDiscount();
  }, [calculateTotalDiscount]);
  
  const formattedCouponDiscounts = useMemo(() => {
    return Object.entries(selectedCoupons)
      .filter(([, coupon]) => Boolean(coupon))
      .map(([type, coupon]) => ({
        type,
        coupon,
        discount: calculateCouponDiscount(coupon),
        formattedDiscount: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(calculateCouponDiscount(coupon))
      }));
  }, [selectedCoupons, calculateCouponDiscount]);

  const totalPriceAfterDiscount = useMemo(() => {
    if (!data?.totalPrice) return 0;
    const totalDiscount = calculateTotalDiscount();
    return data.totalPrice - totalDiscount + 30000;
  }, [data, calculateTotalDiscount]);

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
      toast.error("Please select an address");
      return;
    }

    try {
      const coupons = Object.values(selectedCoupons).filter(Boolean).map(coupon => coupon._id);
      
      const orderData = {
        address: selectedAddress,
        paymentMethod: selectedPaymentMethod,
        coupons: coupons,
        totalDiscount: totalDiscount
      };

      const result = await createOrder(orderData).unwrap();
      
      if (selectedPaymentMethod === "momo") {
        window.location.href = result.payUrl;
      } else {
        navigate(`/order/${result._id}`);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create order");
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
    }).format(totalPriceAfterDiscount);
  }, [totalPriceAfterDiscount]);

  useEffect(() => {
    if (selectedCoupon) {
      const type = selectedCoupon.target_type || 'ORDER';
      setSelectedCoupons(prev => ({
        ...prev,
        [type]: selectedCoupon
      }));
    }
  }, [selectedCoupon]);

  useEffect(() => {
    const coupons = Object.values(selectedCoupons).filter(Boolean);
    if (coupons.length > 0) {
      setSelectedCoupon(coupons[0]);
    } else {
      setSelectedCoupon(null);
    }
  }, [selectedCoupons]);

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Confirm - payment
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={8.5}>
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
        </Grid>

        <Grid item xs={3.5}>
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

              <Box height={10}></Box>

              <CouponSelector
                selectedCoupon={selectedCoupon}
                setSelectedCoupon={(coupon) => {
                  setSelectedCoupon(coupon);
                  if (coupon) {
                    const type = coupon.target_type || 'ORDER';
                    setSelectedCoupons(prev => ({
                      ...prev,
                      [type]: coupon
                    }));
                  } else {
                    setSelectedCoupons({
                      PRODUCT: null,
                      FREESHIPPING: null,
                      ORDER: null
                    });
                  }
                }}
              />

              <Divider sx={{ my: 2 }} />
              <Box display="flex" flexDirection="column" gap={2}>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  justifyContent={"space-between"}
                >
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(data?.totalPrice || 0)}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  justifyContent={"space-between"}
                >
                  <Typography variant="body1">Phí vận chuyển:</Typography>
                  <Typography variant="body1">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(30000)}
                  </Typography>
                </Box>

                {formattedCouponDiscounts.length > 0 ? (
                  formattedCouponDiscounts.map(({ coupon, formattedDiscount }) => (
                    <Box
                      key={coupon._id}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      justifyContent={"space-between"}
                    >
                      <Typography variant="body1" sx={{ color: "secondary.main" }}>
                        Giảm giá ({coupon.code}):
                      </Typography>
                      <Typography variant="body1" sx={{ color: "secondary.main" }}>
                        -{formattedDiscount}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    justifyContent={"space-between"}
                  >
                    <Typography variant="body1">Giảm giá:</Typography>
                    <Typography variant="body1">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(0)}
                    </Typography>
                  </Box>
                )}

                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  justifyContent={"space-between"}
                >
                  <Typography variant="body1">
                    Tổng ({data?.totalItems} sản phẩm):
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
          </Box>
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOrder}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
  );
}

export default CheckoutPage;
