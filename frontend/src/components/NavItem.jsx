import PropTypes from "prop-types";
import  Link  from "react-router-dom";
import  ListItem  from "@mui/material/ListItem";
import  ListItemButton  from "@mui/material/ListItemButton";
import  ListItemIcon  from "@mui/material/ListItemIcon";
import  ListItemText  from "@mui/material/ListItemText";
import  Tooltip  from "@mui/material/Tooltip";
import  Typography  from "@mui/material/Typography";
import  {useTheme}  from "@mui/material/styles"; // Import useTheme

const NavItem = ({ to, icon, text, open = false, onClick = undefined }) => {
  const theme = useTheme(); // Correct position of useTheme hook

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
        <Tooltip title={text} placement="right">
          <ListItemButton
            onClick={onClick}
            sx={[
              { minHeight: 48, px: 2.5 },
              open
                ? { justifyContent: "initial" }
                : { justifyContent: "center" },
            ]}
          >
            <ListItemIcon
              sx={[
                { color: theme.palette.text.secondary },
                { minWidth: 0, justifyContent: "center" },
                open ? { mr: 3 } : { mr: "auto" },
              ]}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body1" // You can customize the variant if needed
                  sx={{
                    fontWeight: "bold", // Try bold font weight here
                    color: theme.palette.text.secondary,
                    opacity: open ? 1 : 0,
                  }}
                >
                  {text}
                </Typography>
              }
            />
          </ListItemButton>
        </Tooltip>
      </Link>
    </ListItem>
  );
};

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  open: PropTypes.bool,
  onClick: PropTypes.func,
};

export default NavItem;
