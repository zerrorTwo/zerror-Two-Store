import { useState } from "react";
import PropTypes from "prop-types";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Switcher = ({ icon, text, open = false, dropdownItems = [] }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <Tooltip title={text} placement="right">
        <ListItemButton
          onClick={handleOpen}
          sx={[
            { minHeight: 48, px: 2.5 },
            open ? { justifyContent: "initial" } : { justifyContent: "center" },
          ]}
        >
          <ListItemIcon
            sx={[
              { minWidth: 0, justifyContent: "center" },
              open ? { mr: 3 } : { mr: "auto" },
            ]}
          >
            {icon || (
              <ArrowRightIcon sx={{ color: theme.palette.text.secondary }} />
            )}
          </ListItemIcon>

          <ListItemText
            primary={text}
            sx={{
              color: theme.palette.text.secondary,
              ...(open ? { opacity: 1 } : { opacity: 0 }),
            }}
          />
        </ListItemButton>
      </Tooltip>

      {/* Dropdown Menu */}
      <Menu
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: theme.palette.primary.main, // Background color
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {dropdownItems.map((item, index) => (
          <MenuItem
            sx={{ color: theme.palette.text.primary }}
            key={index}
            component={Link} // Use Link as the component
            to={item.to} // Pass the `to` prop for navigation
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </ListItem>
  );
};

Switcher.propTypes = {
  icon: PropTypes.element, // Icon to display
  text: PropTypes.string.isRequired, // Title of the Switcher
  open: PropTypes.bool, // Menu open/close state
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // Item label
      to: PropTypes.string.isRequired, // Path for navigation
    })
  ), // Dropdown items
};

export default Switcher;
