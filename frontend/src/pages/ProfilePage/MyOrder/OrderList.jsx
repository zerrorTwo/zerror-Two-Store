import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { PRIMITIVE_URL } from "../../../redux/constants";
import PropTypes from "prop-types";

function OrderList({ allOrders, lastOrderRef, isLoading }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                    sx={{ color: "white", bgcolor: "secondary.main" }}
                    variant="outlined"
                    size="small"
                  >
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

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && allOrders.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6">Không có đơn hàng nào</Typography>
        </Box>
      )}
    </Box>
  );
}

OrderList.propTypes = {
  allOrders: PropTypes.array.isRequired,
  lastOrderRef: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default OrderList;
