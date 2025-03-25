import { useState, useEffect, useRef, useCallback } from "react";
import { useGetUserOrderQuery } from "../../../redux/api/checkoutSlice";
import OrderList from "./OrderList";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";

const MyOrderAll = () => {
  const [page, setPage] = useState(1);
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [canFetchMore, setCanFetchMore] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fetchingRef = useRef(false); // Sử dụng ref để theo dõi trạng thái fetch

  // Sử dụng các trạng thái từ RTK Query
  const { 
    data, 
    isLoading, 
    isFetching, 
    isError, 
    error 
  } = useGetUserOrderQuery({
    page,
    limit: 2,
    filter: searchTerm
  }, {
    // Chỉ gọi API khi online
    skip: !isOnline,
  });

  // Theo dõi trạng thái mạng
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Xử lý lỗi từ API
  useEffect(() => {
    if (isError) {
      toast.error(`Lỗi tải dữ liệu: ${error?.data?.message || 'Không thể kết nối đến server'}`);
      setCanFetchMore(false); // Dừng việc fetch khi có lỗi
    }
  }, [isError, error]);

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

    // Cập nhật trạng thái fetch và kiểm tra hasMore
    fetchingRef.current = false;
    setCanFetchMore(!!data.hasMore);
  }, [data, page]);

  // Infinite Scroll với kiểm soát chặt chẽ
  const observer = useRef();
  const lastOrderRef = useCallback(
    (node) => {
      // Không quan sát nếu đang tải, đã fetch hoặc không có thêm dữ liệu
      if (isLoading || isFetching || !canFetchMore || !isOnline || fetchingRef.current) return;
      
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && canFetchMore && isOnline && !fetchingRef.current) {
            fetchingRef.current = true; // Đánh dấu đang fetch
            setPage((prevPage) => prevPage + 1);
          }
        },
        {
          rootMargin: "100px",
          threshold: 0.1,
        }
      );
      
      if (node) observer.current.observe(node);
    },
    [isLoading, isFetching, canFetchMore, isOnline]
  );

  // Xử lý search với debounce
  const searchTimeoutRef = useRef(null);
  const handleSearch = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    
    // Clear timeout trước đó nếu có
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      if (newTerm !== searchTerm) {
        setPage(1);
        setAllOrders([]);
        setCanFetchMore(true);
        fetchingRef.current = false;
      }
    }, 500);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Thông báo offline */}
      {!isOnline && (
        <Box sx={{ mb: 2, p: 2, bgcolor: "#FFF3CD", borderRadius: 1 }}>
          <Typography color="warning.dark">
            Bạn đang offline. Không thể tải thêm dữ liệu.
          </Typography>
        </Box>
      )}
      
      {/* Search Box */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm"
          value={searchTerm}
          onChange={handleSearch}
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
        fetchMoreOrders={() => {
          if (canFetchMore && isOnline && !fetchingRef.current && !isLoading && !isFetching) {
            fetchingRef.current = true;
            setPage((prev) => prev + 1);
          }
        }}
      />

      {!isLoading && !isFetching && allOrders.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
          Không có đơn hàng nào
        </Typography>
      )}
    </Box>
  );
};

export default MyOrderAll;