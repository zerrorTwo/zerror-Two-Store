import { useState, useEffect, memo } from "react"; // Import useEffect
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { 
  CssBaseline, 
  Divider, 
  List, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  useMediaQuery,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import NavAdminItem from "../../components/NavAdminItem";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { EventBusyOutlined, LogoutOutlined, Menu as MenuIcon } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  width: "100%",
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.primary,
}));

const MemoizedNavAdminItem = memo(NavAdminItem);

const menuItems = [
  { icon: <HomeOutlinedIcon />, text: "Home", path: "/admin/home" },
  { icon: <BarChartIcon />, text: "Dashboard", path: "/admin/dashboard" },
  { icon: <AddCircleOutlineIcon />, text: "Create Product", path: "/admin/create-product" },
  { icon: <Inventory2OutlinedIcon />, text: "Product", path: "/admin/product" },
  { icon: <ShoppingCartOutlinedIcon />, text: "Order", path: "/admin/order" },
  { icon: <CategoryOutlinedIcon />, text: "Category", path: "/admin/cate" },
  { icon: <PeopleOutlinedIcon />, text: "User", path: "/admin/user" },
  { icon: <SettingsOutlinedIcon />, text: "Settings", path: "/admin/settings" },
  { icon: <EventBusyOutlined />, text: "Event", path: "/admin/event" },
  { icon: <LogoutOutlined />, text: "Logout", path: "/admin/logout" },
];

function LayoutAdmin() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("");
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  useEffect(() => {
    const path = location.pathname.split("/")[2];
    setSelectedItem(path || "home");
  }, [location]);

  return (
    <Box
      component={"main"}
      sx={{ 
        flexGrow: 1, 
        pt: { xs: 2, sm: 5 }, 
        px: { xs: 2, sm: 5, md: 10 }, 
        height: "100vh", 
        width: "100%" 
      }}
      bgcolor={"white"}
    >
      <CssBaseline />
      <Grid container spacing={3}>
        {isXs ? (
          <Grid xs={12} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                2Store Admin
              </Typography>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 3,
                sx: {
                  width: '250px',
                  maxHeight: '80vh'
                }
              }}
            >
              {menuItems.map((item) => (
                <MenuItem 
                  key={item.text}
                  onClick={() => handleMenuItemClick(item.path)}
                  selected={selectedItem === item.path.split('/')[2]}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        ) : (
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

                  {menuItems.map((item) => (
                    <Box key={item.text}>
                      <Divider
                        variant="middle"
                        sx={{ bgcolor: theme.palette.text.primary }}
                      />
                      <MemoizedNavAdminItem
                        icon={item.icon}
                        text={item.text}
                        isSelected={selectedItem === item.path.split('/')[2]}
                        link={item.path}
                      />
                    </Box>
                  ))}
                </List>
              </Item>
            </Box>
          </Grid>
        )}
        <Grid size={isXs ? 12 : 9.5}>
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
