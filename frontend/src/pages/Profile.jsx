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
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NavAdminItem from "../components/NavAdminItem";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { Outlet } from "react-router";
import { useLocation } from "react-router";
import { Grid2 } from "@mui/material";

function Profile() {
  const theme = useTheme();
  const MemoizedNavAdminItem = memo(NavAdminItem);
  const user = useSelector(selectCurrentUser);
  const location = useLocation(); // Get the current location
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    const path = location.pathname.split("/")[2] || "dashboard";
    setSelectedItem(path);
  }, [location]);

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
                  maxWidth: "200px", // Đặt giới hạn chiều rộng phù hợp
                }}
              >
                {user?.userName}
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
                link="/profile"
                icon={<FavoriteBorderOutlinedIcon />}
                text="My Favorites"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                link="/profile"
                icon={<RateReviewOutlinedIcon />}
                text="My Reviews"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                link="/profile"
                icon={<HistoryOutlinedIcon />}
                text="Recently Visited"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                link="/profile/my-account"
                icon={<AccountCircleOutlinedIcon />}
                text="My Account"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                link="/layout"
                icon={<AccountCircleOutlinedIcon />}
                text="My Account"
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
    </Container>
  );
}

export default Profile;
