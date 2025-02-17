import {
  Typography,
  Box,
  Drawer,
  Divider,
  Button,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import PropTypes from "prop-types";
import AddressItem from "./AddressItem";
import { useState } from "react";

const isLoading = false;

const list = (anchor, toggleDrawer, selectedAddress, setSelectedAddress) => (
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
    {/* Header  */}
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
            "&:hover": {
              textDecoration: "underline",
            },
          }}
          variant="body1"
          onClick={toggleDrawer("right", true)}
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
        {/* Pass selectedAddress and setSelectedAddress to AddressItem */}
        <AddressItem
          id={1}
          selected={selectedAddress === 1}
          setSelectedAddress={setSelectedAddress}
        />
        <AddressItem
          id={2}
          selected={selectedAddress === 2}
          setSelectedAddress={setSelectedAddress}
        />
        <AddressItem
          id={3}
          selected={selectedAddress === 3}
          setSelectedAddress={setSelectedAddress}
        />
        <AddressItem
          id={4}
          selected={selectedAddress === 4}
          setSelectedAddress={setSelectedAddress}
        />
        <AddressItem
          id={5}
          selected={selectedAddress === 5}
          setSelectedAddress={setSelectedAddress}
        />
        <AddressItem
          id={6}
          selected={selectedAddress === 6}
          setSelectedAddress={setSelectedAddress}
        />
        {/* Add more AddressItem components as needed */}
      </Box>
    </Box>

    {/* Footer */}
    <Box
      sx={{
        pr: 2,
        position: "sticky",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <DialogActions>
        <Button
          onClick={toggleDrawer(anchor, false)}
          sx={{
            color: "text.secondary",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
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
  const [selectedAddress, setSelectedAddress] = useState(null); // State to track selected address

  return (
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
      {list(anchor, toggleDrawer, selectedAddress, setSelectedAddress)}
    </Drawer>
  );
}

AddressDrawer.propTypes = {
  anchor: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default AddressDrawer;
