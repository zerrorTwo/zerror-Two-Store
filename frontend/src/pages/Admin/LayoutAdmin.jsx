import { useState, useEffect, memo } from "react";
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
  ListItemText,
  Toolbar,
  CardMedia,
  Avatar,
} from "@mui/material";
import NavAdminItem from "../../components/NavAdminItem";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  EventBusyOutlined,
  LogoutOutlined,
  Menu as MenuIcon,
} from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";

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
  {
    icon: <AddCircleOutlineIcon />,
    text: "Create Product",
    path: "/admin/create-product",
  },
  { icon: <Inventory2OutlinedIcon />, text: "Product", path: "/admin/product" },
  { icon: <ShoppingCartOutlinedIcon />, text: "Order", path: "/admin/order" },
  { icon: <CategoryOutlinedIcon />, text: "Category", path: "/admin/cate" },
  { icon: <PeopleOutlinedIcon />, text: "User", path: "/admin/user" },
  { icon: <ReceiptOutlinedIcon />, text: "Coupon", path: "/admin/coupon" },
  { icon: <EventBusyOutlined />, text: "Event", path: "/admin/event" },
];

function LayoutAdmin() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState("");
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAvatarClick = (event) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleAvatarMenuClose = () => {
    setAvatarAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
    handleAvatarMenuClose(); // Đóng cả menu avatar nếu đang mở
  };

  useEffect(() => {
    const path = location.pathname.split("/")[2];
    setSelectedItem(path || "home");
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const datePart = currentTime.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timePart = currentTime.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDateTime = `${datePart}, ${timePart}`;

  return (
    <>
      <CssBaseline />
      <Toolbar
        sx={{ px: 0, justifyContent: "space-between", bgcolor: "primary.main" }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CardMedia
            component="img"
            image="/Assets/haha.png"
            alt="Logo"
            sx={{
              height: { xs: "30px", md: "45px" },
              borderRadius: "50%",
              width: "auto",
            }}
          />
          <Typography
            variant="h6"
            sx={{
              display: { xs: "none", sm: "block" },
              ml: 2,
              color: "white !important",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            SHOPPING
          </Typography>
        </Link>

        <Box
          sx={{
            bgcolor: "common.white",
            color: "common.black",
            width: "100%",
            mx: { xs: "10px", sm: "20px" },
            p: 1,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            {formattedDateTime}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
            <Avatar alt="User Avatar" src="/Assets/avatar.png" />
          </IconButton>
          <Menu
            anchorEl={avatarAnchorEl}
            open={Boolean(avatarAnchorEl)}
            onClose={handleAvatarMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                width: "150px",
              },
            }}
          >
            <MenuItem onClick={() => handleMenuItemClick("/admin/logout")}>
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              onClick={handleMenuClick}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: "250px",
            maxHeight: "80vh",
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => handleMenuItemClick(item.path)}
            selected={selectedItem === item.path.split("/")[2]}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </Menu>

      <Box
        sx={{
          flexGrow: 1,
          pt: { xs: 2, sm: 5 },
          px: { xs: 2, sm: 5, md: 10 },
          width: "100%",
        }}
        bgcolor={"white"}
      >
        <Grid container spacing={3}>
          {!isXs && (
            <Grid size={2.5}>
              <Box
                sx={{
                  position: "sticky",
                  top: 40,
                  width: "100%",
                  height: "fit-content",
                  border: "1px solid #555",
                  borderRadius: 2,
                }}
              >
                <Item>
                  <List
                    sx={{ display: "flex", flexDirection: "column", pb: 0 }}
                  >
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
                          isSelected={selectedItem === item.path.split("/")[2]}
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
    </>
  );
}

export default LayoutAdmin;
