import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useRef, useCallback, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import { useGetUserOrderQuery } from "../../../redux/api/checkoutSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { PRIMITIVE_URL } from "../../../redux/constants";

function MyOrderAll() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState([]);
  const userId = useSelector(selectCurrentUser)?._id;

  const { data, isLoading } = useGetUserOrderQuery({
    userId,
    page,
    limit: 2,
  });

  useEffect(() => {
    if (data?.orders) {
      setAllOrders((prev) => {
        const newOrders = data.orders.filter(
          (order) => !prev.some((prevOrder) => prevOrder._id === order._id)
        );
        return page === 1 ? data.orders : [...prev, ...newOrders];
      });
    }
  }, [data, page]);
  
  // Cập nhật allOrders khi có dữ liệu mới
  useEffect(() => {
    if (data?.orders) {
      if (page === 1) {
        // Nếu là trang đầu tiên, thay thế hoàn toàn
        setAllOrders(data.orders);
      } else {
        // Nếu là trang tiếp theo, thêm vào cuối
        setAllOrders((prev) => {
          const existingIds = new Set(prev.map((order) => order._id));
          const newOrders = data.orders.filter(
            (order) => !existingIds.has(order._id)
          );
          return [...prev, ...newOrders];
        });
      }
    }
  }, [data, page]);



  const observer = useRef();
  const lastOrderRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data?.hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, data?.hasMore]
  );


  return (
    <Box sx={{ width: "100%" }}>
      {/* Search Box */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "#F5F5F5",
              },
            },
          }}
        />
      </Box>

      {/* Orders List */}
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
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
                          "0%": {
                            transform: "translateX(-100%) rotate(45deg)",
                          },
                          "100%": {
                            transform: "translateX(100%) rotate(45deg)",
                          },
                        },
                        "&:hover": {
                          bgcolor: "secondary.light",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      color="primary"
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
                    <Box sx={{ flex: 1 }}>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body1" color="text.secondary">
                        Tổng tiền:
                      </Typography>
                      <Typography variant="h6" color="secondary.main">
                        ₫
                        {(
                          product.variations[0]?.price *
                          product.variations[0]?.quantity
                        )?.toLocaleString()}
                      </Typography>
                    </Box>
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
                      <Button
                        sx={{ color: "white", bgcolor: "secondary.main" }}
                        variant="outlined"
                        size="small"
                        color="primary"
                      >
                        Đánh giá
                      </Button>
                    )}
                  {order.state === "DELIVERED" &&
                    order.paymentStatus === "PAID" && (
                      <Button
                        sx={{ color: "white", bgcolor: "secondary.main" }}
                        variant="outlined"
                        size="small"
                        color="primary"
                      >
                        Mua lại
                      </Button>
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

        {!isLoading && data.orders.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6">Không có đơn hàng nào</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MyOrderAll;
