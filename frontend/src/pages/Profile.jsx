import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid2,
  List,
  Typography,
  useTheme,
} from "@mui/material";
import { memo } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NavAdminItem from "../components/NavAdminItem";

function Profile() {
  const theme = useTheme();
  const MemoizedNavAdminItem = memo(NavAdminItem);
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
            <Box display={"flex"} alignItems={"center"} gap={1} mb={2}>
              <Avatar />
              <Typography variant="h6">Anhnam</Typography>
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
                isSelected
                to="/layout"
                icon={<DashboardOutlinedIcon />}
                text="Dashboard"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                to="/layout"
                icon={<ShoppingCartOutlinedIcon />}
                text="My Orders"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                to="/layout"
                icon={<FavoriteBorderOutlinedIcon />}
                text="My Favorites"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                to="/layout"
                icon={<RateReviewOutlinedIcon />}
                text="My Reviews"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                to="/layout"
                icon={<HistoryOutlinedIcon />}
                text="Recently Visited"
              />
              <Divider
                variant="middle"
                sx={{ bgcolor: theme.palette.text.primary }}
              />
              <MemoizedNavAdminItem
                to="/layout"
                icon={<AccountCircleOutlinedIcon />}
                text="My Account"
              />
            </List>
          </Box>
        </Grid2>
        <Grid2 size={9.5}>
          <Box
            pt={2}
            maxHeight={"500px"}
            minHeight={"500px"}
            sx={{ overflowY: "auto" }}
            borderRadius={2}
            height={"200px"}
            border={"1px solid"}
            borderColor={"silver"}
          ></Box>
        </Grid2>
      </Grid2>
    </Container>
  );
}

export default Profile;
