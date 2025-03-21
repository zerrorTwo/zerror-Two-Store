import { useState, useEffect, memo } from "react"; // Import useEffect
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { CssBaseline, Divider, List, Typography } from "@mui/material";
import NavAdminItem from "../../components/NavAdminItem";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Link, Outlet, useLocation } from "react-router-dom"; // Import useLocation
import { EventBusyOutlined, LogoutOutlined } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  width: "100%",
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.primary,
}));

const MemoizedNavAdminItem = memo(NavAdminItem); // Wrap NavAdminItem with memo

function LayoutAdmin() {
  const theme = useTheme();
  const location = useLocation(); // Get the current location
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    // Update selectedItem based on the current path
    const path = location.pathname.split("/")[2]; // Get the second segment of the path
    setSelectedItem(path || "home"); // Default to "home" if path is empty
  }, [location]);

  return (
    <Box
      component={"main"}
      sx={{ flexGrow: 1, pt: 5, px: 10, height: "100vh", width: "100%" }}
      bgcolor={"white"}
    >
      <CssBaseline />
      <Grid container spacing={3}>
        <Grid size={2.5}>
          <Box
            sx={{
              position: "sticky",
              top: 40,
              width: "100%",
              height: "fix-content",
              border: "1px solid #555",
              borderRadius: 2,
            }}
          >
            <Item>
              <List sx={{ display: "flex", flexDirection: "column", pb: 0 }}>
                <Link to={"/"} style={{ textDecoration: "none" }}>
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
                      sx={{
                        color: "secondary.main",
                      }}
                      variant="h5"
                      textTransform={"uppercase"}
                      fontWeight={"bold"}
                    >
                      2Store
                    </Typography>
                  </Box>
                </Link>

                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  icon={<HomeOutlinedIcon />}
                  text="Home"
                  isSelected={selectedItem === "home"}
                  link="/admin/home"
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  icon={<BarChartIcon />}
                  text="Dashboard"
                  isSelected={selectedItem === "dashboard"}
                  link="/admin/dashboard"
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  icon={<AddCircleOutlineIcon />}
                  text="Create Product"
                  isSelected={selectedItem === "create-product"}
                  link="/admin/create-product"
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  icon={<Inventory2OutlinedIcon />}
                  text="Product"
                  isSelected={selectedItem === "product"}
                  link="/admin/product"
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  icon={<ShoppingCartOutlinedIcon />}
                  text="Order"
                  isSelected={selectedItem === "order"}
                  link="/admin/order"
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  icon={<CategoryOutlinedIcon />}
                  text="Category"
                  isSelected={selectedItem === "cate"}
                  link="/admin/cate"
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  icon={<PeopleOutlinedIcon />}
                  text="User"
                  isSelected={selectedItem === "user"}
                  link="/admin/user"
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  icon={<SettingsOutlinedIcon />}
                  text="Settings"
                  isSelected={selectedItem === "settings"}
                  link="/admin/settings"
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  icon={<EventBusyOutlined />}
                  text="Event"
                  isSelected={selectedItem === "logout"}
                  link="/admin/settings"
                />
                <Divider
                  variant="middle"
                  sx={{ bgcolor: theme.palette.text.primary }}
                />
                <MemoizedNavAdminItem
                  icon={<LogoutOutlined />}
                  text="Logout"
                  isSelected={selectedItem === "logout"}
                  link="/admin/settings"
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
