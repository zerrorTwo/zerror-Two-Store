import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

const NavItem = ({ to, icon, text, open = false, onClick = undefined }) => (
  <ListItem disablePadding sx={{ display: "block" }}>
    <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
      <Tooltip title={text} placement="right">
        <ListItemButton
          onClick={onClick}
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
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={text}
            sx={[open ? { opacity: 1 } : { opacity: 0 }]}
          />
        </ListItemButton>
      </Tooltip>
    </Link>
  </ListItem>
);

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  open: PropTypes.bool,
  onClick: PropTypes.func,
};

export default NavItem;
