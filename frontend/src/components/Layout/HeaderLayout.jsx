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
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartPopover from "../Cart/CartPopover";
import RecentSearch from "./RecentSearch";
import { useGetMiniCartQuery } from "../../redux/api/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { logOut, selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useLogoutMutation } from "../../redux/api/authApiSlice";
import { toast } from "react-toastify";
import { Avatar } from "@mui/material";

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
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const {
    data,
    error: cartError,
    isLoading: cartLoading,
  } = useGetMiniCartQuery() || {};
  const [logout] = useLogoutMutation();

  const [searchText, setSearchText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isRecentSearchHovered, setIsRecentSearchHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [cartPopoverVisible, setCartPopoverVisible] = useState(false);
  const recentSearchRef = useRef(null);

  const showRecentSearch = isInputFocused || isRecentSearchHovered;

  // Handlers
  const handleSearchAppBar = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!searchText.trim()) return;
    const searchResult = { id: Date.now().toString(), name: searchText };
    recentSearchRef.current?.addRecentSearch(searchResult);
    setSearchText("");
    navigate(`/search?name=${searchText}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") handleSearchAppBar(event);
  };

  const handleSelectRecentSearch = (product) => {
    setSearchText(product.name);
    setIsInputFocused(false);
    setIsRecentSearchHovered(false);
    navigate(`/search?name=${product.name}`);
  };

  const handleRecentSearchHoverChange = (isHovered) =>
    setIsRecentSearchHovered(isHovered);

  const handleCartClick = () => navigate("/cart");
  const handlePopoverOpen = () => setCartPopoverVisible(true);
  const handlePopoverClose = () => setCartPopoverVisible(false);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) =>
    setMobileMoreAnchorEl(event.currentTarget);

  const handleLogout = async () => {
    try {
      if (!user) return;
      const result = await logout().unwrap();
      if (result) {
        dispatch(logOut());
        navigate("/");
        handleMenuClose();
      }
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "An unexpected error occurred"
      );
    }
  };

  // Menu renders
  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      sx={{ top: "50px !important" }}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem
        component={Link}
        to="/profile"
        sx={{ px: 4, py: 1 }}
        onClick={handleMenuClose}
      >
        Profile
      </MenuItem>
      <MenuItem
        component={Link}
        to="/profile/my-order"
        sx={{ px: 4, py: 1 }}
        onClick={handleMenuClose}
      >
        My order
      </MenuItem>
      {user?.isAdmin && (
        <MenuItem
          component={Link}
          to="/admin/dashboard"
          sx={{ px: 4, py: 1 }}
          onClick={handleMenuClose}
        >
          Manage
        </MenuItem>
      )}
      <MenuItem
        component={Link}
        to="/logout"
        sx={{ px: 4, py: 1 }}
        onClick={handleLogout}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleCartClick}>
        <IconButton size="large" aria-label="show cart items" color="inherit">
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
          aria-controls={menuId}
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
    <Box position="static" sx={{ flexGrow: 1 }}>
      <AppBar sx={{ py: 1 }} bgcolor="secondary.main">
        <Container>
          <Toolbar sx={{ px: 0, justifyContent: "space-between" }}>
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

            <Search
              sx={{
                bgcolor: "common.white",
                color: "common.black",
                width: "100% !important",
                mx: { xs: "10px", sm: "20px" },
                position: "relative",
              }}
            >
              <SearchIconWrapper
                sx={{ zIndex: 10000 }}
                onClick={(e) => handleSearchAppBar(e)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              >
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                sx={{
                  width: "100%",
                  "& .MuiInputBase-input": { width: "85%" },
                }}
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
              {showRecentSearch && (
                <RecentSearch
                  ref={recentSearchRef}
                  onSelect={handleSelectRecentSearch}
                  onHoverChange={handleRecentSearchHoverChange}
                />
              )}
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
                  onClick={handleCartClick}
                  size="large"
                  aria-label="show cart items"
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
              {user ? (
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
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  {user?.avatar ? (
                    <Avatar
                      src={user?.avatar}
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: "secondary.main",
                        fontSize: "2rem",
                      }}
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        bgcolor: "secondary.main",
                        fontSize: "2rem",
                      }}
                    >
                      {user?.userName?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  <Typography
                    fontWeight="bold"
                    ml={0.5}
                    variant="caption"
                    sx={{
                      maxWidth: "60px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.userName}
                  </Typography>
                </IconButton>
              ) : (
                <Button
                  onClick={() => navigate("/login")}
                  sx={{ textTransform: "none", color: "common.white" }}
                  variant="contained"
                >
                  Login
                </Button>
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
