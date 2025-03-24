import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Popover from "@mui/material/Popover";
import CardMedia from "@mui/material/CardMedia";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import PropTypes from "prop-types";
import AddressItem from "./AddressItem";
import { useEffect, useState } from "react";
import AddressPopover from "./AddressPopover";
import { useGetAllUserAddressQuery } from "../../redux/api/addressSlice";

const isLoading = false;

const list = (
  anchor,
  handleOpenPopover,
  selectedAddress,
  setSelectedAddress,
  allAddress,
  handleConfirmAddress
) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={2}
    maxHeight="80vh"
    px={2}
    sx={{
      pr: "0px", // Tránh khoảng trống bên phải
      scrollbarWidth: "thin", // Firefox: làm nhỏ thanh scroll
      "&::-webkit-scrollbar": {
        width: "6px", // Chrome/Safari: làm nhỏ thanh scroll
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#aaa", // Màu của thanh cuộn
        borderRadius: "4px",
      },
    }}
  >
    {/* Header */}
    <Box>
      <Box
        pr={2}
        gap={2}
        pt={1}
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
        {allAddress?.length > 0 ? (
          allAddress.map((item) => (
            <AddressItem
              key={item._id}
              id={item._id}
              item={item}
              selected={selectedAddress === item._id} // Kiểm tra nếu item được chọn
              setSelectedAddress={setSelectedAddress}
              handleOpenPopover={handleOpenPopover}
            />
          ))
        ) : (
          <Box>
            <CardMedia
              component="img"
              sx={{ height: "100%", width: "100%", objectFit: "cover" }}
              image={`Assets/location.png`}
              loading="lazy"
            />
            <Typography textAlign={"center"} variant="h6">
              Empty here.
            </Typography>
          </Box>
        )}
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
          onClick={(event) => handleConfirmAddress(event)}
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

function AddressDrawer({ anchor, state, toggleDrawer, setConfirmAddress }) {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: allAddress } = useGetAllUserAddressQuery();

  // ✅ Hàm tối ưu: Đóng Drawer & mở Popover cùng lúc
  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget); // Mở Popover
    toggleDrawer(anchor, false)(event); // Đóng Drawer
  };

  const handleOpenDrawer = (event) => {
    toggleDrawer(anchor, true)(event); // Đóng Drawer
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    if (allAddress?.length > 0) {
      setSelectedAddress(allAddress[0]?._id); // Chọn phần tử đầu tiên mặc định
      setConfirmAddress(allAddress[0]?._id); // Chọn phần tử đầu tiên mặc định
    }
  }, [allAddress, setConfirmAddress]);

  const handleConfirmAddress = (event) => {
    setConfirmAddress(selectedAddress);
    toggleDrawer(anchor, false)(event); // Đóng Drawer
  };

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
        {list(
          anchor,
          handleOpenPopover,
          selectedAddress,
          setSelectedAddress,
          allAddress,
          handleConfirmAddress
        )}
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
        <AddressPopover
          handleOpenDrawer={handleOpenDrawer}
          handleClose={handleClose}
        />
      </Popover>
    </>
  );
}

AddressDrawer.propTypes = {
  anchor: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  setConfirmAddress: PropTypes.func.isRequired,
};

export default AddressDrawer;
