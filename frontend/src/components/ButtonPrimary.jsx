import PropTypes from "prop-types";
import { Button, CircularProgress, useTheme } from "@mui/material";

function ButtonPrimary({ text, onClick, isLoading }) {
  const theme = useTheme();
  return (
    <Button
      onClick={onClick}
      sx={{ backgroundColor: theme.palette.button.backgroundColor }}
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
