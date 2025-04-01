import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from "@mui/material";
import PropTypes from "prop-types";
import ScheduleIcon from "@mui/icons-material/Schedule";

// Lấy dữ liệu từ localStorage
const getRecentSearchesFromStorage = () => {
  return JSON.parse(localStorage.getItem("recentSearches") || "[]");
};

// Lưu dữ liệu vào localStorage
const saveRecentSearchesToStorage = (searches) => {
  localStorage.setItem("recentSearches", JSON.stringify(searches));
};

// Component RecentSearch
const RecentSearch = forwardRef(({ onSelect, onHoverChange }, ref) => {
  const [recentSearches, setRecentSearches] = useState(
    getRecentSearchesFromStorage
  );

  // Đồng bộ với localStorage
  useEffect(() => {
    saveRecentSearchesToStorage(recentSearches);
  }, [recentSearches]);

  // Thêm sản phẩm vào danh sách tìm kiếm gần đây
  const addRecentSearch = (product) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      const updated = [{ ...product, timestamp: Date.now() }, ...filtered];
      return updated.slice(0, 10); // Giới hạn 10 sản phẩm
    });
  };

  // Xóa một mục khỏi danh sách tìm kiếm gần đây
  const handleDelete = (event, product) => {
    event.stopPropagation(); // Ngăn chặn sự kiện onClick của ListItem
    setRecentSearches((prev) => prev.filter((item) => item.id !== product.id));
  };

  // Expose addRecentSearch ra ngoài qua ref
  useImperativeHandle(ref, () => ({
    addRecentSearch,
  }));

  // Xử lý chọn sản phẩm từ danh sách
  const handleSelect = (product) => {
    if (onSelect) {
      onSelect(product);
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "102%",
        left: 0,
        right: 0,
        boxShadow: 3,
        borderRadius: 1,
        maxHeight: "500px",
        overflowY: "auto",
        zIndex: 1000,
        bgcolor: "background.paper",
      }}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <List dense>
        {recentSearches.length === 0 ? (
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            No recent searches yet.
          </Typography>
        ) : (
          recentSearches.map((item) => (
            <ListItem
              key={item.id}
              onClick={() => handleSelect(item)}
              sx={{ py: 1 }}
            >
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <ScheduleIcon sx={{ color: "text.secondary" }} />
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                secondary={new Date(item.timestamp).toLocaleString()}
              />
              <ListItemButton
                sx={{ display: "inline-block", flexGrow: "0" }}
                onClick={(event) => handleDelete(event, item)}
              >
                Delete
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
});

// Định nghĩa PropTypes
RecentSearch.propTypes = {
  onSelect: PropTypes.func,
  onHoverChange: PropTypes.func,
};

RecentSearch.displayName = "RecentSearch";

export default RecentSearch;
