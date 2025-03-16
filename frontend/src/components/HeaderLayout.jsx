import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Button, CardMedia, Container } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartPopover from "./Cart/CartPopover";
import { useGetMiniCartQuery } from "../redux/api/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../redux/features/auth/authSlice";
import { useLogoutMutation } from "../redux/api/authApiSlice";
import { toast } from "react-toastify";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.1),
  marginRight: theme.spacing(2),
  marginLeft: 0,

  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  right: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  backgroundColor: "common.white",
  borderLeft: "1px solid",
  borderColor: "text.hover",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function HeaderLayout() {
  const navigate = useNavigate();
  const a = useSelector(selectCurrentUser)?._id;
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");

  const userId = useSelector(selectCurrentUser)?._id;

  const {
    data,
    error: cartError,
    isLoading: cartLoading,
  } = useGetMiniCartQuery(userId) || {}; // Tránh lỗi khi data là undefined

  const handleCartClick = () => {
    navigate("/cart");
  };

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [cartPopoverVisible, setCartPopoverVisible] = useState(false);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handlePopoverOpen = () => {
    setCartPopoverVisible(true);
  };

  const handlePopoverClose = () => {
    setCartPopoverVisible(false);
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = async () => {
    try {
      if (a) {
        const result = await logout().unwrap();
        if (result) {
          dispatch(logOut());
          navigate("/");
          window.location.reload();
        }
        setAnchorEl(null);
        handleMobileMenuClose();
      }
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "An unexpected error occurred"
      );
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearchAppBar = () => {
    // Your search logic here
    console.log("Search input value: ", searchText);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchAppBar();
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      sx={{ top: "50px !important" }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link
        to={"/profile"}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      </Link>
      <Link
        to={"/profile/my-order"}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <MenuItem onClick={handleMenuClose}>My order</MenuItem>
      </Link>
      <Link
        to={"/logout"}
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Link>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={data?.totalItems} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Cart</p>
      </MenuItem>

      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }} position="static">
      <AppBar sx={{ py: 1 }} bgcolor={"secondary.main"}>
        <Container>
          <Toolbar sx={{ px: "0 !important", justifyContent: "space-between" }}>
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
                component="div"
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                    marginLeft: 2,
                    color: "white !important",
                    fontWeight: "bold",
                    fontStyle: "italic",
                  },
                }}
              >
                SHOPPING
              </Typography>
            </Link>
            <Search
              id="Search"
              sx={{
                bgcolor: "common.white",
                color: "common.black",
                width: "100% !important",
                mx: { xs: "10px", sm: "20px" },
              }}
            >
              <SearchIconWrapper
                sx={{ zIndex: 10000 }}
                id="Search"
                onClick={handleSearchAppBar}
              >
                <SearchIcon id="Search" />
              </SearchIconWrapper>
              <StyledInputBase
                sx={{
                  width: "100%",
                  "& .MuiInputBase-input": {
                    width: "85%",
                  },
                }}
                id="Search"
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </Search>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
                flexGrow: 1,
                justifyContent: "flex-end",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <IconButton
                  onClick={() => handleCartClick()}
                  size="large"
                  aria-label="show 4 new"
                  color="inherit"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                >
                  <Badge
                    showZero
                    badgeContent={data?.totalItems || 0}
                    color="primary"
                  >
                    <ShoppingCartIcon sx={{ color: "common.white" }} />
                  </Badge>
                </IconButton>

                {cartPopoverVisible && (
                  <CartPopover
                    data={data || {}}
                    error={!!cartError}
                    loading={cartLoading}
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                  />
                )}
              </Box>

              {!a ? (
                // <Box
                //   mx={1}
                //   px={1}
                //   py={0.5}
                //   border={"1px solid #999"}
                //   borderRadius={2}
                //   display={"flex"}
                //   alignItems={"center"}
                //   gap={1}
                //   sx={{
                //     cursor: "pointer",
                //   }}
                // >
                <Button
                  onClick={() => {
                    navigate("/login");
                  }}
                  sx={{
                    display: "inline-block",
                    textTransform: "none",
                    color: "common.white",
                  }}
                  variant="contained"
                >
                  Login
                </Button>
              ) : (
                // </Box>
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  sx={{
                    mr: 0,
                    bgcolor: "primary.main",
                    borderRadius: 6,
                    py: 1,
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  <AccountCircle />
                  <Typography fontWeight={"bold"} ml={0.5} variant="caption">
                    Le Nam
                  </Typography>
                </IconButton>
              )}
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
