import { Button, ButtonGroup, useTheme } from "@mui/material";
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
  return (
    <ButtonGroup size="medium" aria-label="Small button group">
      <Button
        onClick={() => handleDecreaseQuantity()}
        key="one"
        sx={{
          color: "text.primary", // Màu chữ
          borderColor: "text.primary", // Màu viền
          mr: "-1px",
        }}
      >
        -
      </Button>
      <input
        type="tel"
        key="two"
        style={{
          width: "45px",
          textAlign: "center",
          color: theme.palette.secondary.main, // Màu chữ trong input
          //   fontWeight: "bold",
          fontSize: "1rem",
        }}
        value={quantity}
        onInput={(e) => {
          let inputValue = e.target.value.replace(/[^0-9]/g, "");
          // Default to "1" if empty or less than 1
          if (!inputValue || parseInt(inputValue) < 1) {
            inputValue = "";
          }
          setQuantity(inputValue);
        }}
      />

      <Button
        onClick={() => handleIncreaseQuantity()}
        key="three"
        sx={{
          color: "text.primary", // Màu chữ
          borderColor: "text.primary", // Màu viền
          borderLeftColor: "transparent",
        }}
      >
        +
      </Button>
    </ButtonGroup>
  );
}
QuantityGroup.propTypes = {
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
};

export default QuantityGroup;
