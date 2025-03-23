import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { PRIMITIVE_URL } from "../../../redux/constants";
import PropTypes from "prop-types";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import PaymentIcon from "@mui/icons-material/Payment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import { toast } from "react-toastify";
import {
  useCreateMomoPaymentMutation,
  useVerifyPaymentUrlExpirationMutation,
} from "../../../redux/api/checkoutSlice";
import CommentPopover from "../../../components/CommentPopover";
import SkeletonOrder from "../../../components/SkeletonOrder";

const styles = {
  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
};

function OrderList({ allOrders, lastOrderRef, isLoading, isFetching }) {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [ratingAnchorEl, setRatingAnchorEl] = useState(null);
  const [paymentAnchorEl, setPaymentAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleRatingClick = (event, order) => {
    if (paymentAnchorEl) setPaymentAnchorEl(null);
    setRatingAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handlePayClick = (event, order) => {
    if (ratingAnchorEl) setRatingAnchorEl(null);
    setPaymentAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleClose = () => {
    setRatingAnchorEl(null);
    setPaymentAnchorEl(null);
    setTimeout(() => {
      setSelectedOrder(null);
    }, 300);
  };

  const handleSubmitReview = ({ rating, comment }) => {
    console.log("Submitting review for order:", selectedOrder._id);
    console.log("Rating:", rating);
    console.log("Comment:", comment);
    handleClose();
  };

  const [createMomoPayment] = useCreateMomoPaymentMutation();
  const [verifyPaymentUrl] = useVerifyPaymentUrlExpirationMutation();

  const handlePaymentMethodSelect = async (method) => {
    if (!selectedOrder) return;

    handleClose();
    setPaymentLoading(true);

    try {
      switch (method) {
        case "MOMO":
          await processMomoPayment(selectedOrder);
          break;
        case "VNPAY":
          toast.info("Chức năng thanh toán VNPAY đang được phát triển");
          break;
        case "BANK_TRANSFER":
          toast.info("Chức năng thanh toán chuyển khoản đang được phát triển");
          break;
        default:
          toast.error("Phương thức thanh toán không hợp lệ");
      }
    } catch (error) {
      toast.error(
        "Lỗi xử lý thanh toán: " + (error.message || "Không xác định")
      );
      console.error("Payment error:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const processMomoPayment = async (order) => {
    try {
      if (order.paymentUrl) {
        const verifyResult = await verifyPaymentUrl(order._id).unwrap();

        if (verifyResult.resultCode !== 49) {
          window.location.href = order.paymentUrl;
          return;
        }

        const response = await createMomoPayment({
          orderId: order._id,
        }).unwrap();

        if (response.payUrl) {
          window.location.href = response.payUrl;
        } else {
          toast.error("Không thể tạo link thanh toán MoMo");
        }
      }

      const response = await createMomoPayment({ orderId: order._id }).unwrap();

      if (response.payUrl) {
        window.location.href = response.payUrl;
      } else {
        toast.error("Không thể tạo link thanh toán MoMo");
      }
    } catch (error) {
      toast.error(
        "Lỗi khi tạo thanh toán MoMo: " +
          (error.data?.message || error.message || "Không xác định")
      );
      throw error;
    }
  };

  const ratingOpen = Boolean(ratingAnchorEl);
  const paymentOpen = Boolean(paymentAnchorEl);
  const ratingId = ratingOpen ? "rating-popover" : undefined;
  const paymentId = paymentOpen ? "payment-popover" : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        pb: isFetching ? 0 : 2,
      }}
    >
      {allOrders.map((order, index) => (
        <Card
          key={index}
          ref={index === allOrders.length - 1 ? lastOrderRef : null}
          sx={{ width: "100%", bgcolor: "white" }}
        >
          <CardContent>
            {/* Order Header */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="body2" color="text.secondary">
                Mã đơn hàng: {order._id}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="body1" sx={{ color: "#051a" }}>
                  {order.deliveryState}
                </Typography>
                <Divider orientation="vertical" />
                <Typography variant="body1" sx={{ color: "secondary.main" }}>
                  {order.paymentStatus}
                </Typography>
                {order.paymentStatus === "UNPAID" && (
                  <Button
                    sx={{
                      color: "white",
                      bgcolor: "secondary.main",
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-50%",
                        left: "-50%",
                        width: "200%",
                        height: "200%",
                        background:
                          "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
                        transform: "rotate(45deg)",
                        animation: "shine 2s infinite",
                      },
                      "@keyframes shine": {
                        "0%": { transform: "translateX(-100%) rotate(45deg)" },
                        "100%": { transform: "translateX(100%) rotate(45deg)" },
                      },
                      "&:hover": { bgcolor: "secondary.light" },
                    }}
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={(e) => handlePayClick(e, order)}
                    disabled={paymentLoading}
                  >
                    {paymentLoading && selectedOrder?._id === order._id ? (
                      <CircularProgress
                        size={20}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />
                    ) : null}
                    Thanh toán ngay
                  </Button>
                )}
              </Box>
            </Box>

            <Divider />

            {/* Order Items */}
            {order.products.map((product, idx) => (
              <Box key={idx} sx={{ display: "flex", gap: 2, my: 2 }}>
                <img
                  src={`${PRIMITIVE_URL}${product.mainImg}`}
                  alt={product.name}
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography color="text.secondary" variant="body1">
                      {product.name}
                    </Typography>
                    {product.variations[0]?.type && (
                      <Typography variant="body2" color="text.secondary">
                        Phân loại:{" "}
                        {Object.entries(product.variations[0].type)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      x{product.variations[0]?.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₫{product.variations[0]?.price?.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="secondary.main">
                    ₫
                    {(
                      product.variations[0]?.price *
                      product.variations[0]?.quantity
                    )?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}

            <Divider />

            {/* Order Footer */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Typography variant="body1">
                Phí vận chuyển: ₫{order.deliveryFee?.toLocaleString()}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                {order.canReview && (
                  <Button
                    sx={{
                      color: "white",
                      bgcolor: "secondary.main",
                      border: "none",
                    }}
                    variant="outlined"
                    size="small"
                    onClick={(e) => handleRatingClick(e, order)}
                  >
                    Đánh giá
                  </Button>
                )}
                <Button
                  sx={{ color: "black", bgcolor: "#F5F5F5", border: "none" }}
                  variant="outlined"
                  size="small"
                >
                  Xem chi tiết
                </Button>
                {order.state === "DELIVERED" &&
                  order.paymentStatus === "PAID" && (
                    <>
                      <Button
                        sx={{ color: "white", bgcolor: "secondary.main" }}
                        variant="outlined"
                        size="small"
                      >
                        Đánh giá
                      </Button>
                      <Button
                        sx={{ color: "white", bgcolor: "secondary.main" }}
                        variant="outlined"
                        size="small"
                      >
                        Mua lại
                      </Button>
                    </>
                  )}
                {order.state === "PENDING" && (
                  <Button
                    sx={{ color: "white", bgcolor: "error.main" }}
                    variant="outlined"
                    size="small"
                  >
                    Hủy đơn hàng
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      {(isLoading || isFetching) && (
        <Box sx={styles}>
          <SkeletonOrder />
        </Box>
      )}

      {!isLoading && allOrders.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6">Không có đơn hàng nào</Typography>
        </Box>
      )}

      {/* Comment Popover */}
      <CommentPopover
        id={ratingId}
        anchorEl={ratingAnchorEl}
        onClose={handleClose}
        onSubmit={handleSubmitReview}
      />

      {/* Payment Method Popover */}
      <Popover
        id={paymentId}
        open={paymentOpen}
        anchorEl={paymentAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box sx={{ width: 280, p: 1 }}>
          <Typography variant="subtitle1" sx={{ p: 1, fontWeight: "bold" }}>
            Chọn phương thức thanh toán
          </Typography>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handlePaymentMethodSelect("MOMO")}>
                <ListItemIcon>
                  <PhoneAndroidIcon sx={{ color: "#d82d8b" }} />
                </ListItemIcon>
                <ListItemText primary="Ví MoMo" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handlePaymentMethodSelect("VNPAY")}
              >
                <ListItemIcon>
                  <PaymentIcon sx={{ color: "#0066B3" }} />
                </ListItemIcon>
                <ListItemText primary="VN Pay" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handlePaymentMethodSelect("BANK_TRANSFER")}
              >
                <ListItemIcon>
                  <AccountBalanceIcon sx={{ color: "#388e3c" }} />
                </ListItemIcon>
                <ListItemText primary="Chuyển khoản ngân hàng" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Popover>
    </Box>
  );
}

OrderList.propTypes = {
  allOrders: PropTypes.array.isRequired,
  lastOrderRef: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default OrderList;
