import Button from "@mui/material/Button";
import PropTypes from "prop-types"; // Import PropTypes for prop validation

function ButtonWithIcon({ text, icon, onClick }) {
  return (
    <Button
      onClick={onClick}
      sx={{
        border: "1px solid silver",
        color: "common.black",
        bgcolor: "inherit",
        boxShadow: "none",
        "&:hover": { boxShadow: "none" },
      }}
      variant="contained"
      startIcon={<img src={icon} alt="icon" />}
    >
      {text}
    </Button>
  );
}

ButtonWithIcon.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default ButtonWithIcon;
