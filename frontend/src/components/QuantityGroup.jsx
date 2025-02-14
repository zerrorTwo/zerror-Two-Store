import { alpha, Box, Button, TextField, useTheme } from "@mui/material";
import PropTypes from "prop-types";

function QuantityGroup({ quantity, setQuantity }) {
  const theme = useTheme();

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleInputChange = (e) => {
    let inputValue = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    if (parseInt(inputValue) < 1) {
      inputValue = "1"; // Default to 1 if empty or less than 1
    }
    setQuantity(parseInt(inputValue));
  };

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      {/* Decrease Button */}
      <Button
        onClick={handleDecreaseQuantity}
        sx={{
          maxWidth: { xs: "35px", sm: "40px" },
          minWidth: { xs: "35px", sm: "40px" },
          maxHeight: { xs: "35px", sm: "40px" },
          minHeight: { xs: "35px", sm: "40px" },
          color: alpha(theme.palette.common.black, 0.5), // Change to white for better contrast
          backgroundColor: "text.hover", // Primary color
          borderRadius: "8px",
          fontSize: "1.25rem", // Larger font size for button text
          "&:hover": {
            backgroundColor: "text.hover", // Darken on hover
          },
        }}
      >
        -
      </Button>

      {/* Quantity Input */}
      <TextField
        value={quantity}
        onChange={handleInputChange}
        variant="outlined"
        type="tel"
        size="small"
        sx={{
          width: "50px", // Adjust width
          height: "40px",
          color: theme.palette.secondary.main,
          backgroundColor: "white", // White background for input
          "& .MuiOutlinedInput-root": {
            height: "100%",
            borderRadius: "8px", // Rounded input borders
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.common.black, 0.2), // Change border color to primary (red) on focus
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: alpha(theme.palette.common.black, 0.2), // Highlight border color when hovering
            },
          },
          "& .MuiInputBase-input": {
            textAlign: "center",
            px: 0,
            fontSize: "0.875rem",
            color: theme.palette.secondary.main,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.common.black, 0.2), // Default border color
          },
        }}
      />

      {/* Increase Button */}
      <Button
        onClick={handleIncreaseQuantity}
        sx={{
          maxWidth: { xs: "35px", sm: "40px" },
          minWidth: { xs: "35px", sm: "40px" },
          maxHeight: { xs: "35px", sm: "40px" },
          minHeight: { xs: "35px", sm: "40px" },
          color: alpha(theme.palette.common.black, 0.5), // Change to white for better contrast
          backgroundColor: "text.hover", // Primary color
          borderRadius: "8px",
          fontSize: "1.25rem", // Larger font size for button text
          "&:hover": {
            backgroundColor: "text.hover", // Darken on hover
          },
        }}
      >
        +
      </Button>
    </Box>
  );
}

QuantityGroup.propTypes = {
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
};

export default QuantityGroup;
