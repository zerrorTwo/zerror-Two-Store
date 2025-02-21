import {
  Typography,
  Box,
  Drawer,
  Divider,
  Button,
  DialogActions,
  CircularProgress,
  Popover,
} from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import PropTypes from "prop-types";
import AddressItem from "./AddressItem";
import { useState } from "react";
import AddressPopover from "./AddressPopover";

const isLoading = false;

const list = (
  anchor,
  handleOpenPopover,
  selectedAddress,
  setSelectedAddress
) => (
  <Box
    py={1}
    pl={2}
    role="presentation"
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    {/* Header */}
    <Box>
      <Box
        pr={2}
        gap={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center" gap={0.5}>
          <AddLocationIcon color="secondary" />
          <Typography color="secondary" variant="h6" fontWeight="bold">
            Delivery Address
          </Typography>
        </Box>
        <Typography
          sx={{
            cursor: "pointer",
            color: "#05a",
            fontWeight: "bold",
            "&:hover": { textDecoration: "underline" },
          }}
          variant="body1"
          onClick={handleOpenPopover} // Gọi hàm tối ưu
        >
          Add new address
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />

      {/* Content */}
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={2}
        maxHeight="80vh"
        overflow="auto"
      >
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <AddressItem
            key={id}
            id={id}
            selected={selectedAddress === id}
            setSelectedAddress={setSelectedAddress}
          />
        ))}
      </Box>
    </Box>

    {/* Footer */}
    <Box sx={{ pr: 2, position: "sticky", bottom: 0, left: 0, right: 0 }}>
      <DialogActions>
        <Button
          onClick={handleOpenPopover}
          sx={{
            color: "text.secondary",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            borderRadius: "8px",
            boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "secondary.light",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          {isLoading ? <CircularProgress size={25} color="inherit" /> : "Save"}
        </Button>
      </DialogActions>
    </Box>
  </Box>
);

function AddressDrawer({ anchor, state, toggleDrawer }) {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // ✅ Hàm tối ưu: Đóng Drawer & mở Popover cùng lúc
  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget); // Mở Popover
    toggleDrawer(anchor, false)(event); // Đóng Drawer
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Drawer
        anchor={anchor}
        open={state[anchor]}
        onClose={toggleDrawer(anchor, false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "400px",
            borderRadius: "8px 0 0 8px",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {list(anchor, handleOpenPopover, selectedAddress, setSelectedAddress)}
      </Drawer>

      {/* Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        // onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <AddressPopover handleClose={handleClose} />
      </Popover>
    </>
  );
}

AddressDrawer.propTypes = {
  anchor: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default AddressDrawer;
