import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import LoginIcon from "@mui/icons-material/Login";
import { Outlet, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import NavItem from "../components/NavItem";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/api/authApiSlice";
import { logOut, selectCurrentUser } from "../redux/features/auth/authSlice";
import Switcher from "../components/Switcher";
import { toast } from "react-toastify";
import { useState } from "react";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  backgroundColor: theme.palette.secondary.main,
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  backgroundColor: theme.palette.secondary.main,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function Layout() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const isUser = useSelector(selectCurrentUser);

  const admin = isUser?.user?.isAdmin || isUser?.isAdmin;
  const dispatch = useDispatch();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await logout().unwrap();
      console.log(result);
      if (result) {
        dispatch(logOut());
        navigate("/");
      }
      setOpenDialog(false);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "An unexpected error occurred"
      );
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          left: 0,
          width: "0px", // Chỉ rộng bằng ngăn kéo khi mở
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                color: theme.palette.text.secondary,
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              display: open ? "block" : "none",
              color: theme.palette.text.secondary,
            }}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Home Item */}
          <NavItem to="/" icon={<HomeIcon />} text="Home" open={open} />

          {/* Menu Item */}
          <NavItem
            to="/menu"
            icon={<ShoppingBagIcon />}
            text="Menu"
            open={open}
          />

          {/* Cart Item */}
          <NavItem
            to="/cart"
            icon={<ShoppingCartIcon />}
            text="Cart"
            open={open}
          />

          {/* Favorite Item */}
          <NavItem
            to="/favorite"
            icon={<FavoriteIcon />}
            text="Favorite"
            open={open}
          />

          {isUser && (
            <>
              {/* Account Item */}
              <NavItem
                to="/profile"
                icon={<AccountCircleIcon />}
                text="Account"
                open={open}
              />
            </>
          )}

          {admin && (
            <>
              {/* Account Item */}
              <Switcher
                icon={
                  <SpaceDashboardIcon
                    sx={{ color: theme.palette.text.secondary }}
                  />
                }
                text="Dashboard"
                open={open}
                dropdownItems={[
                  { label: "Analytics", to: "/" },
                  { label: "Order", to: "/" },
                  { label: "Product", to: "/product" },
                  { label: "Category", to: "/category" },
                  { label: "User", to: "/user" },
                ]}
              />
            </>
          )}

          {/* Login/Logout Button */}
          <Box sx={{ marginTop: "auto" }}>
            {isUser ? (
              <>
                <NavItem
                  to="#"
                  icon={<LoginIcon />}
                  text="Logout"
                  open={open}
                  onClick={handleClickOpen}
                />
                <Dialog
                  open={openDialog}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  {isLoading && (
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress color="inherit" />
                    </Box>
                  )}
                  <DialogTitle id="alert-dialog-title">
                    {"Do you really want to log out?"}
                  </DialogTitle>
                  <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleLogout}>Yes</Button>
                  </DialogActions>
                </Dialog>
              </>
            ) : (
              <NavItem
                to="/login"
                icon={<AccountCircleIcon />}
                text="Login"
                open={open}
              />
            )}
          </Box>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, px: 3, height: "100vh" }}>
        <Outlet />
      </Box>
    </Box>
  );
}
