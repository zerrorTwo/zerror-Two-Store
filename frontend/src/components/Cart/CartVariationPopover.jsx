import  Box  from "@mui/material/Box";
import  Button  from "@mui/material/Button";
import  Chip  from "@mui/material/Chip";
import  IconButton  from "@mui/material/IconButton";
import  Paper  from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import  CloseIcon from "@mui/icons-material/Close";
import { useState, useMemo, useEffect } from "react";
import { useUpdateVariationMutation } from "../../redux/api/cartSlice";
import { toast } from "react-toastify";

// Function to get pricing for selected attributes
const getPricingForSelectedAttributes = (
  selectedAttributes,
  pricingData,
  data
) => {
  const selectedVariation = pricingData.find((pricingItem) =>
    Object.keys(selectedAttributes).every(
      (key) => pricingItem[key] === selectedAttributes[key]
    )
  );

  if (selectedVariation) {
    return {
      price: selectedVariation.price,
      stock: selectedVariation.stock,
    };
  }
  return {
    price: data?.price || 0,
    stock: data?.totalStock || 0,
  };
};

function CartVariationPopover({
  initAttribute,
  data,
  onClose,
  productId,
}) {
  const [updateVar] = useUpdateVariationMutation();
  const [selectedAttributes, setSelectedAttributes] = useState(initAttribute);
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

  // Convert data to attributes2
  const attributes2 = useMemo(() => {
    return Object.keys(data || {})
      .filter((key) => key !== "pricing")
      .map((key) => ({
        label: key,
        key: key,
        options: data[key],
      }));
  }, [data]);

  // Handle attribute click and update the selected attribute
  const handleAttributeClick = (label, option) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [label]: selectedAttributes[label] === option ? null : option, // Toggle selection
    };
    setSelectedAttributes(newSelectedAttributes);
  };

  // Check if all attributes are selected
  const allAttributesSelected = attributes2.every(
    (attr) => selectedAttributes[attr.label]
  );

  // Update pricing when selectedAttributes or pricingData changes
  useEffect(() => {
    const newPricing = getPricingForSelectedAttributes(
      selectedAttributes,
      pricingData,
      data
    );
    setPricing(newPricing);
  }, [selectedAttributes, pricingData, data]);

  const handleUpdateVariation = async () => {
    try {
      if (!allAttributesSelected) {
        toast.error("Please select all attributes.");
        return;
      }
      if (
        JSON.stringify(selectedAttributes) === JSON.stringify(initAttribute)
      ) {
        toast.error("No changes detected.");
        return;
      }
      const data = {
        state: "ACTIVE",
        products: [
          {
            productId: productId,
            variations: [
              {
                oldType: initAttribute,
                type: selectedAttributes,
              },
            ],
          },
        ],
      };

      await updateVar(data).unwrap();
      toast.success("Successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

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
              {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
              {item.options.map((option, idx) => {
                const isSelected = selectedAttributes[item.key] === option;

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
                    disabled={pricing?.stock === 0}
                    label={option}
                    variant={isSelected ? "filled" : "outlined"}
                    onClick={() => handleAttributeClick(item.label, option)}
                  />
                );
              })}
            </Box>
          </Box>
        ))}

        {/* Display the new price */}
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
          onClick={handleUpdateVariation}
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
  productId: PropTypes.string.isRequired,
  initAttribute: PropTypes.object,
};

export default CartVariationPopover;
