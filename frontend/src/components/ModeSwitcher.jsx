import PropTypes from "prop-types";
import { ListItem } from "@mui/material/ListItem";
import { ListItemButton } from "@mui/material/ListItemButton";
import { ListItemIcon } from "@mui/material/ListItemIcon";
import { ListItemText } from "@mui/material/ListItemText";
import { Tooltip } from "@mui/material/Tooltip";
import { Select } from "@mui/material/Select";
import { MenuItem } from "@mui/material/MenuItem";
import { useColorScheme } from "@mui/material/styles";
import { LightMode, DarkMode } from "@mui/icons-material";

const ModeSwitcher = ({ open = false }) => {
  const { mode, setMode } = useColorScheme();

  // Nếu không hỗ trợ chế độ màu, không hiển thị
  if (!mode || !setMode) {
    return null;
  }

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <Tooltip title="Theme Mode" placement="right">
        <ListItemButton
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
            {mode === "light" ? <LightMode /> : <DarkMode />}
          </ListItemIcon>
          <ListItemText
            primary={
              open ? (
                <Select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  variant="standard"
                  disableUnderline
                  sx={{
                    minWidth: 80,
                    color: "inherit",
                  }}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              ) : null
            }
            sx={[open ? { opacity: 1 } : { opacity: 0 }]}
          />
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
};

ModeSwitcher.propTypes = {
  open: PropTypes.bool, // Trạng thái mở/đóng của menu
};

export default ModeSwitcher;
