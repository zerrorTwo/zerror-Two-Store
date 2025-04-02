import PropTypes from "prop-types";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";

const NavAdminItem = ({ icon, text, isSelected, link, onClick }) => {
  const theme = useTheme();

  const handleClick = (event) => {
    if (onClick) {
      onClick(event); // Call the custom onClick handler if provided
    }
  };

  return (
    <ListItem disablePadding sx={{ display: "block", position: "relative" }}>
      {isSelected && (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            width: "4px",
            height: "100%",
            bgcolor: theme.palette.secondary.main,
          }}
        />
      )}
      <ListItemButton
        component={link ? Link : "div"}
        to={link}
        onClick={handleClick}
        sx={{
          minHeight: 60,
          px: 2.5,
          justifyContent: "flex-start",
        }}
      >
        <ListItemIcon
          sx={{
            color: theme.palette.text.secondary,
            minWidth: 0,
            justifyContent: "center",
            mr: 3,
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant="body1"
              sx={{
                fontWeight: isSelected ? "bold" : "normal",
                color: theme.palette.text.secondary,
              }}
            >
              {text}
            </Typography>
          }
        />
        <NavigateNextIcon sx={{ color: "inherit" }} />
      </ListItemButton>
    </ListItem>
  );
};

NavAdminItem.propTypes = {
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  link: PropTypes.string,
  onClick: PropTypes.func, // Added onClick prop type
};

export default NavAdminItem;
