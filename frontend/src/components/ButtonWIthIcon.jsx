import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes for prop validation

function ButtonWithIcon({ text, icon, link }) {
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <Button variant="contained" startIcon={<img src={icon} alt="icon" />}>
        {text}
      </Button>
    </Link>
  );
}

ButtonWithIcon.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default ButtonWithIcon;
