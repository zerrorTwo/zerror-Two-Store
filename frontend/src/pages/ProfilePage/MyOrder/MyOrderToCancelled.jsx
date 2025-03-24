import Box from "@mui/material/Box";
import { useState, useRef, useCallback, useEffect } from "react";
import OrderList from "./OrderList";
import { useGetUserOrderQuery } from "../../../redux/api/checkoutSlice";

function MyOrdertoCancelled() {
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState([]);

  const { data, isLoading } = useGetUserOrderQuery({
    page,
    limit: 2,
    filter: "cancelled",
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

  // Infinite Scroll
  const observer = useRef();
  const lastOrderRef = useCallback(
    (node) => {
      if (isLoading || !data?.hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, data?.hasMore]
  );

  return (
    <Box sx={{ width: "100%" }}>
      {/* Orders List */}
      <OrderList
        allOrders={allOrders}
        lastOrderRef={lastOrderRef}
        isLoading={isLoading}
      />
    </Box>
  );
}

export default MyOrdertoCancelled;
