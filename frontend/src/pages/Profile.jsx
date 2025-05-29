import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { memo, useEffect, useState } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
// import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import NavAdminItem from "../components/NavAdminItem";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Grid2 } from "@mui/material";
import { useLogoutMutation } from "../redux/api/authApiSlice";
import { useDispatch } from "react-redux";
import { logOut } from "../redux/features/auth/authSlice";
import { toast } from "react-toastify";

function Profile() {
  const theme = useTheme();
  const MemoizedNavAdminItem = memo(NavAdminItem);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false); // State for dialog

  useEffect(() => {
    const path = location.pathname.split("/")[2] || "dashboard";
    setSelectedItem(path);
  }, [location]);

  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenConfirm = () => {
    setOpenConfirm(true); // Open the confirmation dialog
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false); // Close the dialog without logging out
  };

  const handleLogout = async () => {
    if (!user) {
      toast.info("No user is currently logged in");
      setOpenConfirm(false);
      return;
    }

    setIsLoggingOut(true);
    try {
      await logout().unwrap();
      dispatch(logOut());
      setTimeout(() => navigate("/"), 0); // Force navigation
      toast.success("Logged out successfully");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error(
        err?.data?.message || err?.error || "An unexpected error occurred"
      );
    } finally {
      setIsLoggingOut(false);
      setOpenConfirm(false);
    }
  };

  return (
    <Container sx={{ pb: 2 }}>
      <Grid2 container spacing={2}>
        <Grid2 size={2.5}>
          <Box
            sx={{ overflowY: "auto" }}
            pt={2}
            display={"flex"}
            flexDirection={"column"}
            borderRadius={2}
            border={"1px solid"}
            borderColor={"silver"}
            alignItems={"center"}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={1}
              mb={2}
              px={2}
              flexDirection={"column"}
            >
              <Avatar />
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                }}
              >
                {user?.userName || "Guest"}
              </Typography>
            </Box>
            <List
              sx={{
                p: 0,
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <MemoizedNavAdminItem
                isSelected={selectedItem === "dashboard"}
                link="/profile/dashboard"
                icon={<DashboardOutlinedIcon />}
                text="Dashboard"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                link="/profile/my-order"
                isSelected={selectedItem === "my-order"}
                icon={<ShoppingCartOutlinedIcon />}
                text="My Orders"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                link="/profile/my-favourite"
                isSelected={selectedItem === "my-favourite"}
                icon={<FavoriteBorderOutlinedIcon />}
                text="My Favorites"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                link="/profile/my-recent"
                isSelected={selectedItem === "my-recent"}
                icon={<HistoryOutlinedIcon />}
                text="Recently Visited"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              {/* <MemoizedNavAdminItem
                link="/profile"
                icon={<RateReviewOutlinedIcon />}
                text="My Reviews"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              /> */}
              <MemoizedNavAdminItem
                isSelected={selectedItem === "my-account"}
                link="/profile/my-account"
                icon={<AccountCircleOutlinedIcon />}
                text="My Account"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                icon={
                  isLoggingOut ? (
                    <CircularProgress size={24} color="error" />
                  ) : (
                    <ExitToAppIcon />
                  )
                }
                text="Logout"
                onClick={handleOpenConfirm} // Open dialog instead of direct logout
                disabled={isLoggingOut}
              />
            </List>
          </Box>
        </Grid2>
        <Grid2 size={9.5}>
          <Box
            minHeight={"100%"}
            sx={{ overflowY: "auto" }}
            borderRadius={2}
            border={"1px solid"}
            borderColor={"silver"}
          >
            <Outlet />
          </Box>
        </Grid2>
      </Grid2>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="logout-confirm-title"
        aria-describedby="logout-confirm-description"
      >
        <DialogTitle id="logout-confirm-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-confirm-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirm}
            color="primary"
            disabled={isLoggingOut}
          >
            No
          </Button>
          <Button
            onClick={handleLogout}
            color="error"
            variant="contained"
            disabled={isLoggingOut}
            autoFocus
          >
            {isLoggingOut ? <CircularProgress size={24} /> : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profile;
