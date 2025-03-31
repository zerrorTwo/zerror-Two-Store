import { Box, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import PropTypes from "prop-types";

function QuantityGroup({
  quantity,
  setQuantity,
  isLoading,
  minQuantity = 1,
  maxQuantity = 99,
}) {
  const handleDecrease = () => {
    if (quantity > minQuantity && !isLoading) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity && !isLoading) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "4px",
        overflow: "hidden",
        width: "fit-content",
      }}
    >
      <IconButton
        onClick={handleDecrease}
        disabled={quantity <= minQuantity || isLoading}
        size="small"
        sx={{ borderRadius: 0 }}
      >
        <RemoveIcon fontSize="small" />
      </IconButton>
      <Box
        sx={{
          padding: "0 8px",
          width: "40px",
          textAlign: "center",
          userSelect: "none",
        }}
      >
        {quantity}
      </Box>
      <IconButton
        onClick={handleIncrease}
        disabled={quantity >= maxQuantity || isLoading}
        size="small"
        sx={{ borderRadius: 0 }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

QuantityGroup.propTypes = {
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  minQuantity: PropTypes.number,
  maxQuantity: PropTypes.number,
};

export default QuantityGroup;
