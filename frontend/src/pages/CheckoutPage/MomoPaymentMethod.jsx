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

function MomoPaymentMethod({ selectedMethod, setSelectedMethod }) {
  const handleSelect = () => {
    setSelectedMethod("momo");
  };

  return (
    <Box
      onClick={handleSelect}
      sx={{
        cursor: "pointer",
        border:
          selectedMethod === "momo" ? "2px solid #EB2F96" : "1px solid silver",
        borderRadius: 1,
        padding: 1,
        background:
          selectedMethod === "momo"
            ? "linear-gradient(90deg, rgba(235, 47, 150, 0.8386) 0%, rgba(235, 47, 150, 0.6734) 35%, rgba(235, 47, 150, 0.3624) 100%)"
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
            src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
            sx={{ height: "30px", width: "auto", objectFit: "cover" }}
            loading="lazy"
          />
          <Typography
            color={selectedMethod === "momo" ? "common.white" : "black"}
            variant="body1"
          >
            MoMo E-Wallet
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedMethod === "momo"}
              icon={<RadioButtonUncheckedIcon sx={{ color: "#EB2F96" }} />}
              checkedIcon={
                <CheckCircleIcon
                  sx={{
                    color: "#EB2F96",
                    "&.Mui-checked": { color: "#EB2F96" },
                  }}
                />
              }
            />
          }
        />
      </Box>
      <Typography
        color={selectedMethod === "momo" ? "common.white" : "black"}
        variant="body2"
      >
        Pay via MoMo E-Wallet
      </Typography>
    </Box>
  );
}

MomoPaymentMethod.propTypes = {
  selectedMethod: PropTypes.string.isRequired,
  setSelectedMethod: PropTypes.func.isRequired,
};

export default MomoPaymentMethod;
