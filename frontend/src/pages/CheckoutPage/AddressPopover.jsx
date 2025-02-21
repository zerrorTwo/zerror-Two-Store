import {
  Autocomplete,
  Box,
  Button,
  InputBase,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

const top100Films = ["122", "123"];

function AddressPopover({ handleClose }) {
  // State lưu thông tin người dùng nhập vào
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: null,
    district: null,
    ward: null,
    street: "",
  });

  // Hàm cập nhật state
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Khi nhấn submit
  const handleSubmit = () => {
    console.log("Form Data:", formData); // In ra object
    handleClose(); // Đóng popover
  };

  return (
    <Box
      p={2}
      display="flex"
      flexDirection="column"
      maxHeight="500px"
      minHeight="500px"
      width="350px"
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        flex={1}
        overflow="auto"
      >
        <Typography variant="h6" color="common.black">
          New Address
        </Typography>

        {/* Name & Phone */}
        <Box display="flex" gap={2}>
          <InputBase
            required
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            sx={{
              flex: 1,
              px: 1,
              py: 0.5,
              border: "1px solid silver",
              borderRadius: 1,
            }}
          />
          <InputBase
            required
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            sx={{
              flex: 1,
              px: 1,
              py: 0.5,
              border: "1px solid silver",
              borderRadius: 1,
            }}
          />
        </Box>

        {/* City */}
        <Autocomplete
          disablePortal
          fullWidth
          options={top100Films}
          value={formData.city}
          onChange={(_, value) => handleChange("city", value)}
          renderInput={(params) => <TextField {...params} label="City" />}
        />

        {/* District */}
        <Autocomplete
          disablePortal
          fullWidth
          options={top100Films}
          value={formData.district}
          onChange={(_, value) => handleChange("district", value)}
          renderInput={(params) => <TextField {...params} label="District" />}
        />

        {/* Ward */}
        <Autocomplete
          disablePortal
          fullWidth
          options={top100Films}
          value={formData.ward}
          onChange={(_, value) => handleChange("ward", value)}
          renderInput={(params) => <TextField {...params} label="Ward" />}
        />

        {/* Street */}
        <InputBase
          required
          placeholder="Street Name, Building, House No."
          value={formData.street}
          onChange={(e) => handleChange("street", e.target.value)}
          sx={{
            px: 1,
            py: 0.5,
            border: "1px solid silver",
            borderRadius: 1,
          }}
        />
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          px: 2,
          pt: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          borderTop: "1px solid silver",
        }}
      >
        <Button onClick={handleClose} color="inherit" variant="contained">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{ bgcolor: "secondary.main", color: "white" }}
          variant="contained"
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}

AddressPopover.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default AddressPopover;
