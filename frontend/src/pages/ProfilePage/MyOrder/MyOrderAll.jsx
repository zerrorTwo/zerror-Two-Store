import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useGetUserOrderQuery } from "../../../redux/api/checkoutSlice";
import OrderList from "./OrderList";
import { selectCurrentUser } from "../../../redux/features/auth/authSlice";
import {
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

const MyOrderAll = () => {
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const userId = useSelector(selectCurrentUser)?._id;

  const { data, isLoading } = useGetUserOrderQuery({
    userId,
    page,
    limit: 2,
  });

  // Cập nhật danh sách đơn hàng khi có dữ liệu mới
  useEffect(() => {
    if (!data?.orders) return;

    setAllOrders((prev) => {
      const existingIds = new Set(prev.map((order) => order._id));
      const newOrders = data.orders.filter(
        (order) => !existingIds.has(order._id)
      );
      return page === 1 ? data.orders : [...prev, ...newOrders];
    });
  }, [data, page]);

  // Infinite Scroll với debounce và cải tiến hiệu năng
  const observer = useRef();
  const lastOrderRef = useCallback(
    (node) => {
      if (isLoading || isFetching || !data?.hasMore) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isFetching) {
            setIsFetching(true);
            setTimeout(() => {
              setPage((prevPage) => prevPage + 1);
              setIsFetching(false);
            }, 300);
          }
        },
        {
          rootMargin: "100px",
          threshold: 0.1,
        }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, data?.hasMore, isFetching]
  );

  return (
    <Box sx={{ p: 2 }}>
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
              <InputAdornment position="start">🔍</InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": { borderColor: "#F5F5F5" },
            },
          }}
        />
      </Box>
      <OrderList
        allOrders={allOrders}
        lastOrderRef={lastOrderRef}
        isLoading={isLoading || isFetching}
        isFetching={isFetching}
        fetchMoreOrders={() => setPage((prev) => prev + 1)}
      />

      {(isLoading || isFetching) && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && allOrders.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
          Không có đơn hàng nào
        </Typography>
      )}
    </Box>
  );
};

export default MyOrderAll;
