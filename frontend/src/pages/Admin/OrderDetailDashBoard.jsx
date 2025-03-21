import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { Link, useParams } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useUpdateOrderDeliveryStateMutation,
  useUpdateOrderStateMutation,
} from "../../redux/api/checkoutSlice";
import {
  CircularProgress,
  Chip,
  Grid,
  Paper,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Button,
} from "@mui/material";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { PRIMITIVE_URL } from "../../redux/constants";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OrderDetailDashBoard() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useGetOrderByIdQuery(orderId);

  // Define delivery status steps
  const deliverySteps = ["PROCESSING", "SHIPPED", "DELIVERED"];

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "success";
      case "PROCESSING":
        return "info";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      case "PAID":
        return "success";
      case "SHIPPED":
        return "success";
      case "DELIVERED":
        return "success";
      case "FAILED":
        return "error";

      default:
        return "default";
    }
  };

  const [updateOrderState, { isLoading: isUpdatingState }] =
    useUpdateOrderStateMutation();
  const [updateOrderDeliveryState, { isLoading: isUpdatingDeliveryState }] =
    useUpdateOrderDeliveryStateMutation();

  const handleStateOrder = async (state) => {
    try {
      if (state === "CONFIRMED") {
        await updateOrderState({ orderId, state: "CONFIRMED" });
        toast.success("Order confirmed successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (state === "CANCELLED") {
        await updateOrderState({ orderId, state: "CANCELLED" });
        toast.info("Order cancelled", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else if (state === "COMPLETED") {
        await updateOrderState({ orderId, state: "COMPLETED" });
        await updateOrderDeliveryState({ orderId, deliveryState: "DELIVERED" });
        toast.success("Order completed successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(`Error: ${error.message || "Something went wrong"}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeliveryStateOrder = async () => {
    try {
      await updateOrderDeliveryState({ orderId, deliveryState: "SHIPPED" });
      toast.success("Order shipped successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error(
        `Error: ${error.message || "Failed to update shipping status"}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const orderData = order[0];
  const activeStep = deliverySteps.indexOf(orderData.deliveryState);

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Order Details
      </Typography>

      {/* Order Status Card */}
      <Card
        sx={{
          bgcolor: "white",
          marginBottom: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" fontWeight="500">
              Order ID: #{orderData._id}
            </Typography>
            <Chip
              label={orderData.state}
              color={getStatusColor(orderData.state)}
              icon={<CheckCircleIcon />}
              sx={{ fontWeight: "bold" }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {deliverySteps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PaymentIcon sx={{ mr: 1, color: "#1976d2" }} />
                  <Typography variant="h6">Payment Information</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Method:</Typography>
                  <Chip label={orderData.paymentMethod} size="small" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Status:</Typography>
                  <Chip
                    label={orderData.paymentStatus}
                    color={getStatusColor(orderData.paymentStatus)}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">Transaction ID:</Typography>
                  <Typography variant="body1">
                    {orderData.momoRequestId}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <LocalShippingIcon sx={{ mr: 1, color: "#1976d2" }} />
                  <Typography variant="h6">Shipping Information</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body1">Status:</Typography>
                  <Chip
                    label={orderData.deliveryState}
                    color={getStatusColor(orderData.deliveryState)}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">Shipping Fee:</Typography>
                  <Typography variant="body1">
                    ₫{orderData.deliveryFee?.toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Card */}
      <Card
        sx={{
          bgcolor: "white",
          marginBottom: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ShoppingBagIcon sx={{ mr: 1, color: "#1976d2" }} />
            <Typography variant="h5" fontWeight="500">
              Products
            </Typography>
          </Box>

          {orderData.products.map((product, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: "#f9f9f9",
                border: "1px solid #eee",
                borderRadius: 2,
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12} sm={2}>
                  <Avatar
                    variant="rounded"
                    src={`${PRIMITIVE_URL}${product.mainImg}`}
                    alt={product.name}
                    sx={{ width: 80, height: 80 }}
                  />
                </Grid>
                <Grid item xs={12} sm={10}>
                  <Box>
                    <Link
                      style={{ textDecoration: "none" }}
                      to={`/products/${product.slug}`}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="500"
                        noWrap
                        sx={{
                          mb: 1,
                          color: "primary.main",
                        }}
                      >
                        {product.name}
                      </Typography>
                    </Link>

                    {product.variations.map((variation, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <Box>
                          <Chip
                            label={`Size: ${variation.type.size}`}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={`Color: ${variation.type.color}`}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography variant="body2" color="text.secondary">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(variation.price || 10000)}{" "}
                            x {variation.quantity}
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{ color: "primary.main" }}
                          >
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(
                              variation.price * variation.quantity || 10000
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card
        sx={{
          bgcolor: "white",
          marginBottom: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ReceiptIcon sx={{ mr: 1, color: "#1976d2" }} />
            <Typography variant="h5" fontWeight="500">
              Summary
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              p: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1">Total Items:</Typography>
              <Typography variant="body1">
                ₫{orderData.totalPrice?.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body1">Shipping Fee:</Typography>
              <Typography variant="body1">
                ₫{orderData.deliveryFee?.toLocaleString()}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6" fontWeight="bold">
                Total Payment:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ₫{orderData.finalTotal?.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        {orderData.state === "PENDING" && (
          <Button
            variant="contained"
            color="info"
            startIcon={!isUpdatingState && <CheckCircleIcon />}
            disabled={isUpdatingState}
            size="large"
            onClick={() => handleStateOrder("CONFIRMED")}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(25,118,210,0.2)",
            }}
          >
            {isUpdatingState ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Confirm"
            )}
          </Button>
        )}
        {orderData.state === "PENDING" && (
          <Button
            variant="contained"
            color="error"
            startIcon={!isUpdatingState && <CancelIcon />}
            disabled={isUpdatingState}
            size="large"
            onClick={() => handleStateOrder("CANCELLED")}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(25,118,210,0.2)",
            }}
          >
            {isUpdatingState ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Cancel"
            )}
          </Button>
        )}

        {orderData.state === "CONFIRMED" &&
          orderData.deliveryState === "SHIPPED" && (
            <Button
              variant="contained"
              color="success"
              startIcon={!isUpdatingState && <CheckCircleIcon />}
              disabled={isUpdatingState}
              size="large"
              onClick={() => handleStateOrder("COMPLETED")}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(25,118,210,0.2)",
              }}
            >
              {isUpdatingState ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Complete"
              )}
            </Button>
          )}

        {orderData.deliveryState === "PROCESSING" &&
          orderData.state === "CONFIRMED" && (
            <Button
              variant="contained"
              color="success"
              startIcon={!isUpdatingDeliveryState && <LocalShippingIcon />}
              disabled={isUpdatingDeliveryState}
              size="large"
              onClick={() => handleDeliveryStateOrder()}
              sx={{
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(25,118,210,0.2)",
              }}
            >
              {isUpdatingDeliveryState ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Ship"
              )}
            </Button>
          )}
      </Box>
    </Box>
  );
}

export default OrderDetailDashBoard;
