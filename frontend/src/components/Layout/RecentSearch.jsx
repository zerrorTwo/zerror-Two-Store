import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Tooltip,
} from "@mui/material";
import PropTypes from "prop-types";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DeleteIcon from "@mui/icons-material/Delete";

const getRecentSearchesFromStorage = () => {
  return JSON.parse(localStorage.getItem("recentSearches") || "[]");
};

const saveRecentSearchesToStorage = (searches) => {
  localStorage.setItem("recentSearches", JSON.stringify(searches));
};

const RecentSearch = forwardRef(({ onSelect, onHoverChange }, ref) => {
  const [recentSearches, setRecentSearches] = useState(
    getRecentSearchesFromStorage
  );

  useEffect(() => {
    saveRecentSearchesToStorage(recentSearches);
  }, [recentSearches]);

  const addRecentSearch = (product) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      const updated = [{ ...product, timestamp: Date.now() }, ...filtered];
      return updated.slice(0, 10);
    });
  };

  const handleDelete = (event, product) => {
    event.stopPropagation();
    setRecentSearches((prev) => prev.filter((item) => item.id !== product.id));
  };

  useImperativeHandle(ref, () => ({
    addRecentSearch,
  }));

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
        bgcolor: "white",
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
              sx={{
                py: 1,
                "&:hover": {
                  bgcolor: "action.hover",
                  cursor: "pointer",
                },
                transition: "background-color 0.2s ease",
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px" }}>
                <ScheduleIcon sx={{ color: "text.secondary" }} />
              </ListItemIcon>
              <ListItemText primary={item.name} />
              <ListItemButton
                sx={{
                  display: "inline-block",
                  flexGrow: "0",
                  p: 1,
                  minWidth: "unset",
                  "&:hover": {
                    bgcolor: "transparent",
                    "& .MuiSvgIcon-root": {
                      color: "error.main",
                    },
                  },
                  transition: "color 0.2s ease",
                }}
                onClick={(event) => handleDelete(event, item)}
              >
                <Tooltip title="Delete">
                  <DeleteIcon sx={{ color: "text.secondary" }} />
                </Tooltip>
              </ListItemButton>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
});

RecentSearch.propTypes = {
  onSelect: PropTypes.func,
  onHoverChange: PropTypes.func,
};

RecentSearch.displayName = "RecentSearch";

export default RecentSearch;
