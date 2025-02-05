import { useState, memo } from "react"; // Import React.memo
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { CssBaseline, Divider, List, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavAdminItem from "../../components/NavAdminItem";
import { Outlet } from "react-router";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.primary,
}));

const MemoizedNavAdminItem = memo(NavAdminItem); // Wrap NavAdminItem with memo

function LayoutAdmin() {
  const theme = useTheme();
  const [selectedItem, setSelectedItem] = useState("/");

  const handleItemClick = (path) => {
    setSelectedItem(path);
  };

  return (
    <Box
      component={"main"}
      sx={{ flexGrow: 1, py: 2, px: 10, height: "100vh", width: "100%" }}
      bgcolor={"white"}
    >
      <CssBaseline />
      <Grid container spacing={3}>
        <Grid size={2.5}>
          <Box
            sx={{
              height: "fix-content",
              border: "1px solid #555",
              borderRadius: 2,
            }}
          >
            <Item>
              <List sx={{ display: "flex", flexDirection: "column" }}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={1}
                  justifyContent={"center"}
                  my={2}
                >
                  <img
                    style={{ width: "40px", height: "40px" }}
                    src="/Assets/logo.png"
                    alt="2Store Logo"
                  />
                  <Typography
                    variant="h5"
                    textTransform={"uppercase"}
                    fontWeight={"bold"}
                  >
                    2Store
                  </Typography>
                </Box>
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  to="/layout"
                  icon={<HomeIcon />}
                  text="Home"
                  isSelected={selectedItem === "/home"}
                  onClick={() => handleItemClick("/home")}
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  to="/layout"
                  icon={<HomeIcon />}
                  text="Dashboard"
                  isSelected={selectedItem === "/dashboard"}
                  onClick={() => handleItemClick("/dashboard")}
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  to="/layout"
                  icon={<HomeIcon />}
                  text="Settings"
                  isSelected={selectedItem === "/settings"}
                  onClick={() => handleItemClick("/settings")}
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
              </List>
            </Item>
          </Box>
        </Grid>
        <Grid size={9.5}>
          <Item>
            <Box sx={{ border: "1px solid #555", borderRadius: 1, p: 2 }}>
              <Outlet />
            </Box>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LayoutAdmin;
