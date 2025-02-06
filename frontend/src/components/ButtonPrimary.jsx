import PropTypes from "prop-types";
import { Button, CircularProgress } from "@mui/material";

function ButtonPrimary({ text, onClick, isLoading }) {
  return (
    <Button
      onClick={onClick}
      sx={{ backgroundColor: "secondary.main" }}
      variant="contained"
    >
      {isLoading ? <CircularProgress size={25} color="inherit" /> : text}
    </Button>
  );
}

ButtonPrimary.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ButtonPrimary;
