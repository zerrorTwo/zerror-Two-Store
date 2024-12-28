import PropTypes from "prop-types";
import { Button, useTheme } from "@mui/material";

function ButtonOutLined({ text, onClick }) {
  const theme = useTheme();
  return (
    <Button
      sx={{
        "&:hover": {
          color: theme.palette.text.secondary,
          backgroundColor: theme.palette.button.hoverBackgroundColor,
        },
        color: theme.palette.button.backgroundColor,
        borderColor: theme.palette.button.backgroundColor,
      }}
      variant="outlined"
      onClick={onClick}
    >
      {text}
    </Button>
  );
}

ButtonOutLined.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ButtonOutLined;
