import {
  CardMedia,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PropTypes from "prop-types";

function CashPaymentMethod({ selectedMethod, setSelectedMethod }) {
  const handleSelect = () => {
    setSelectedMethod("cash"); // Gán phương thức thanh toán khi chọn
  };

  return (
    <Box
      onClick={handleSelect} // Khi click vào, phương thức thanh toán được chọn
      sx={{
        cursor: "pointer",
        border:
          selectedMethod === "cash" ? "2px solid #05a" : "1px solid silver",
        borderRadius: 1,
        padding: 1,
        background:
          selectedMethod === "cash"
            ? "linear-gradient(90deg, rgba(0,85,170,0.8386) 0%, rgba(0,85,170,0.6734) 35%, rgba(0,85,170,0.3624) 100%)"
            : "white",
      }}
    >
      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <CardMedia
            component="img"
            src="https://img.lazcdn.com/g/tps/tfs/TB1ZP8kM1T2gK0jSZFvXXXnFXXa-96-96.png_2200x2200q75.png_.webp"
            sx={{ height: "30px", width: "auto", objectFit: "cover" }}
            loading="lazy"
          />
          <Typography
            color={selectedMethod === "cash" ? "common.white" : "black"}
            variant="body1"
          >
            Cash on Delivery
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedMethod === "cash"} // Kiểm tra nếu là phương thức đã chọn
              icon={<RadioButtonUncheckedIcon sx={{ color: "#05a" }} />}
              checkedIcon={
                <CheckCircleIcon
                  sx={{
                    color: "#05a",
                    "&.Mui-checked": { color: "#05a" },
                  }}
                />
              }
            />
          }
        />
      </Box>
      <Typography
        color={selectedMethod === "cash" ? "common.white" : "black"}
        variant="body2"
      >
        Pay when you receive
      </Typography>
    </Box>
  );
}

CashPaymentMethod.propTypes = {
  selectedMethod: PropTypes.string.isRequired,
  setSelectedMethod: PropTypes.func.isRequired,
};

export default CashPaymentMethod;
