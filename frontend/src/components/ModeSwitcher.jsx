import PropTypes from "prop-types";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useState, useEffect } from "react";

const ModeSwitcher = ({ open = false }) => {
  const theme = useTheme();
  const [mode, setMode] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("theme", mode);
  }, [mode]);

  const handleChange = (event) => {
    const newMode = event.target.value;
    setMode(newMode);
  };

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
              { color: theme.palette.primary.text },
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
                  onChange={handleChange}
                  variant="standard"
                  disableUnderline
                  sx={{
                    color: theme.palette.primary.text,
                    minWidth: 80,
                    "& .MuiSvgIcon-root": {
                      color: theme.palette.primary.text,
                      fontSize: "1.5rem",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: theme.palette.primary.main,
                        "& .MuiMenuItem-root": {
                          color: theme.palette.primary.text,
                        },
                      },
                    },
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
  open: PropTypes.bool,
};

export default ModeSwitcher;
