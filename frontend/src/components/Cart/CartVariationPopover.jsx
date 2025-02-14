import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState, useMemo } from "react";

function CartVariationPopover({ initAttribute, data, onClose }) {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [pricing, setPricing] = useState({
    price: data?.price || 0,
    stock: data?.totalStock || 0,
  });

  // Use useMemo to memoize the pricingData calculation
  const pricingData = useMemo(() => {
    return Array.isArray(data?.pricing)
      ? data?.pricing || []
      : Object.values(data?.pricing || {});
  }, [data?.pricing]);

  // Chuyển đổi dữ liệu attributes2 từ data
  const attributes2 = useMemo(() => {
    return Object.keys(data || {})
      .filter((key) => key !== "pricing")
      .map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        options: data[key],
      }));
  }, [data]);

  const initAttributesArray = initAttribute
    .split(", ")
    .map((item) => item.trim());
  // Tách initAttribute thành mảng và gán các giá trị vào selectedAttributes
  console.log(initAttributesArray);
  console.log(attributes2);

  // Hàm xử lý sự kiện khi người dùng chọn thuộc tính
  const handleAttributeClick = (label, option) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [label]: selectedAttributes[label] === option ? null : option, // Toggle selection
    };
    setSelectedAttributes(newSelectedAttributes);

    // Kiểm tra nếu tất cả các thuộc tính đã được chọn
    const allAttributesSelected = attributes2.every(
      (attr) => newSelectedAttributes[attr.label]
    );

    if (allAttributesSelected) {
      // Tìm pricing tương ứng với các thuộc tính đã chọn
      const selectedVariation = pricingData.find((pricingItem) =>
        Object.keys(newSelectedAttributes).every(
          (key) => pricingItem[key] === newSelectedAttributes[key]
        )
      );

      if (selectedVariation) {
        setPricing({
          price: selectedVariation.price,
          stock: selectedVariation.stock,
        });
      }
    }
  };

  // Kiểm tra nếu đã chọn đủ tất cả các thuộc tính
  const allAttributesSelected = attributes2.every(
    (attr) => selectedAttributes[attr.label]
  );

  return (
    <Paper
      sx={{
        position: "relative",
        boxShadow: 3,
        borderRadius: 2,
        width: "300px",
        backgroundColor: "common.white",
      }}
    >
      {/* Close Button */}
      <IconButton
        sx={{
          position: "absolute",
          top: "8px",
          right: "8px",
          color: "text.secondary",
        }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>

      <Box display="flex" flexDirection="column" gap={2} p={2}>
        {attributes2.map((item, index) => (
          <Box key={index}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {item.label}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              {item.options.map((option, idx) => {
                const isSelected = selectedAttributes[item.label] === option;

                return (
                  <Chip
                    key={idx}
                    sx={{
                      cursor: "pointer",
                      color: isSelected ? "white" : "text.secondary",
                      bgcolor: isSelected ? "secondary.main" : "white",
                      borderColor: isSelected ? "secondary.main" : "grey.300",
                      "&:hover": {
                        bgcolor: isSelected ? "secondary.light" : "grey.100",
                      },
                    }}
                    label={option}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => handleAttributeClick(item.label, option)}
                  />
                );
              })}
            </Box>
          </Box>
        ))}

        {/* Hiển thị giá mới */}
        <Typography
          variant="body1"
          fontWeight={"bold"}
          sx={{ color: "secondary.main" }}
        >
          New Price:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(pricing.price)}
        </Typography>

        <Button
          fullWidth
          disabled={!allAttributesSelected}
          sx={{
            bgcolor: "secondary.main",
          }}
        >
          Update
        </Button>
      </Box>
    </Paper>
  );
}

CartVariationPopover.propTypes = {
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  initAttribute: PropTypes.string,
};

export default CartVariationPopover;
