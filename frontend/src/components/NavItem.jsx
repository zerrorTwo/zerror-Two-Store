import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

const NavItem = ({ to, icon, text, open, onClick }) => (
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
  to: PropTypes.string.isRequired, // `to` phải là string và bắt buộc
  icon: PropTypes.element.isRequired, // `icon` phải là một React element và bắt buộc
  text: PropTypes.string.isRequired, // `text` phải là string và bắt buộc
  open: PropTypes.bool, // `open` là boolean
  onClick: PropTypes.func, // `onClick` là một function (nếu được sử dụng)
};

NavItem.defaultProps = {
  open: false, // Giá trị mặc định của `open`
  onClick: undefined, // Giá trị mặc định của `onClick`
};

export default NavItem;
