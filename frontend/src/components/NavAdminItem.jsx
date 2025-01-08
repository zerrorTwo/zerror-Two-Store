import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTheme } from "@mui/material/styles";

const NavAdminItem = ({ to, icon, text, isSelected, onClick }) => {
  const theme = useTheme();

  return (
    <ListItem disablePadding sx={{ display: "block", position: "relative" }}>
      {isSelected && (
        <Box
          sx={{
            position: "absolute",
            right: 0,
            width: "4px",
            height: "100%",
            bgcolor: theme.palette.button.backgroundColor,
          }}
        />
      )}
      <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
        <Tooltip title={text} placement="right">
          <ListItemButton
            onClick={onClick}
            sx={{
              minHeight: 60,
              px: 2.5,
              justifyContent: "flex-start",
              //   bgcolor: isSelected ? "#333" : "transparent", // Hiệu ứng nền khi được chọn
              //   "&:hover": {
              //     bgcolor: "#444",
              //   },
            }}
          >
            <ListItemIcon
              sx={{
                color: theme.palette.text.secondary, // Đổi màu icon khi được chọn
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
                    fontWeight: isSelected ? "bold" : "normal", // Font đậm khi được chọn
                    color: theme.palette.text.secondary, // Đổi màu text
                  }}
                >
                  {text}
                </Typography>
              }
            />
            <NavigateNextIcon sx={{ color: "inherit" }} />
          </ListItemButton>
        </Tooltip>
      </Link>
    </ListItem>
  );
};

NavAdminItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

export default NavAdminItem;
