import {
  Autocomplete,
  Box,
  Button,
  InputBase,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Close } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  useLazyGetCityQuery,
  useLazyGetDistrictQuery,
  useLazyGetWardQuery,
} from "../../redux/api/addressSlice";

function AddressPopover({ handleClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: null,
    district: null,
    ward: null,
    street: "",
    setDefault: false,
  });

  const [mapSrc, setMapSrc] = useState(
    "https://maps.google.com/maps?q=Ho%20Chi%20Minh%20City&t=&z=15&ie=UTF8&iwloc=&output=embed"
  );

  // API Fetch Hooks
  const [getCity, { data: cityData, isFetching: loadingCity }] =
    useLazyGetCityQuery();
  const [getDistrict, { data: districtData, isFetching: loadingDistrict }] =
    useLazyGetDistrictQuery();
  const [getWard, { data: wardData, isFetching: loadingWard }] =
    useLazyGetWardQuery();

  const cities = cityData || [];
  const districts = districtData || [];
  const wards = wardData || [];

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectCity = (value) => {
    handleChange("city", value);
    handleChange("district", null);
    handleChange("ward", null);
    if (value) getDistrict(value.id);
  };

  const handleSelectDistrict = (value) => {
    handleChange("district", value);
    handleChange("ward", null);
    if (value) getWard(value.id);
  };

  // 🔹 Tự động cập nhật bản đồ khi địa chỉ thay đổi
  useEffect(() => {
    if (
      formData.city ||
      formData.district ||
      formData.ward ||
      formData.street
    ) {
      const addressParts = [
        formData.street,
        formData.ward?.name,
        formData.district?.name,
        formData.city?.name,
      ].filter(Boolean); // Loại bỏ phần tử rỗng

      if (addressParts.length > 0) {
        const query = encodeURIComponent(addressParts.join(", "));
        setMapSrc(
          `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.street]);

  const handleSubmit = () => {
    console.log("Form Data:", formData);
    handleClose();
  };

  const isFormValid =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.city &&
    formData.district &&
    formData.ward &&
    formData.street.trim();
  return (
    <Box
      pt={2}
      px={2}
      display="flex"
      flexDirection="column"
      width="500px"
      bgcolor={"white"}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        flex={1}
        sx={{ overflowY: "auto" }}
      >
        <Typography variant="h6" color="common.black">
          New Address
        </Typography>

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
              color: "black",
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
              color: "black",
            }}
          />
        </Box>

        <Autocomplete
          sx={{
            ".MuiFormLabel-root": {
              color: "black !important",
              lineHeight: "13px",
            },
            ".MuiFormControl-root": {
              height: "40px",
            },
          }}
          disablePortal
          fullWidth
          options={cities}
          getOptionLabel={(option) => option?.name}
          value={formData.city}
          onOpen={() => cities.length === 0 && getCity()}
          onChange={(_, value) => handleSelectCity(value)}
          loading={loadingCity}
          renderInput={(params) => (
            <TextField
              {...params}
              label="City"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "text.primary",
                  },
                },
                ".MuiInputBase-root": {
                  height: "100%",
                  pr: "10px !important",
                },
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingCity && <CircularProgress size={20} />}
                    {formData.city && (
                      <IconButton
                        onClick={() => handleSelectCity(null)}
                        sx={{ padding: 0.5 }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    )}
                    <ArrowDropDownIcon sx={{ cursor: "pointer" }} />
                  </>
                ),
              }}
            />
          )}
        />
        <Autocomplete
          sx={{
            ".MuiFormLabel-root": {
              color: "black !important",
              lineHeight: "13px",
            },
            ".MuiFormControl-root": {
              height: "40px",
            },
          }}
          disablePortal
          fullWidth
          options={districts}
          getOptionLabel={(option) => option?.name}
          value={formData.district}
          onOpen={() => formData.city && getDistrict(formData.city.id)}
          onChange={(_, value) => handleSelectDistrict(value)}
          loading={loadingDistrict}
          disabled={!formData.city}
          renderInput={(params) => (
            <TextField
              sx={{
                bgcolor:
                  !formData.city || !formData.district ? "#f0f0f0" : "white", // Thay đổi màu nền khi bị vô hiệu hóa
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "text.primary",
                  },
                },
                ".MuiInputBase-root": {
                  height: "100%",
                  pr: "10px !important",
                },
              }}
              {...params}
              label="District"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {formData.district && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDistrict(null);
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    )}
                    <ArrowDropDownIcon />
                  </>
                ),
              }}
            />
          )}
        />

        <Autocomplete
          sx={{
            ".MuiFormLabel-root": {
              color: "black !important",
              lineHeight: "13px",
            },
            ".MuiFormControl-root": {
              height: "40px",
            },
          }}
          disablePortal
          fullWidth
          options={wards}
          getOptionLabel={(option) => option?.name}
          value={formData.ward}
          onOpen={() => formData.district && getWard(formData.district.id)}
          onChange={(_, value) => handleChange("ward", value)}
          loading={loadingWard}
          disabled={!formData.district}
          renderInput={(params) => (
            <TextField
              sx={{
                bgcolor:
                  !formData.city || !formData.district ? "#f0f0f0" : "white", // Thay đổi màu nền khi bị vô hiệu hóa
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "text.primary",
                  },
                },
                ".MuiInputBase-root": {
                  height: "100%",
                  pr: "10px !important",
                },
              }}
              {...params}
              label="Ward"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {formData.ward && (
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleChange("ward", null);
                        }}
                      >
                        <Close fontSize="small" />
                      </IconButton>
                    )}
                    <ArrowDropDownIcon />
                  </>
                ),
              }}
            />
          )}
        />

        <InputBase
          disabled={!formData.city || !formData.district || !formData.ward}
          required
          placeholder="Street Name, Building, House No."
          value={formData.street}
          onChange={(e) => handleChange("street", e.target.value)}
          sx={{
            px: 1,
            py: 0.5,
            border: "1px solid silver",
            borderRadius: 1,
            color: "black",
            bgcolor:
              !formData.city || !formData.district || !formData.ward
                ? "#f0f0f0"
                : "white", // Thay đổi màu nền khi bị vô hiệu hóa
          }}
        />

        <FormControlLabel
          sx={{ height: "30px", justifyContent: "end" }}
          control={
            <Checkbox
              checked={formData.setDefault}
              onChange={(e) => handleChange("setDefault", e.target.checked)}
              sx={{
                color: "text.primary",
                "&.Mui-checked": {
                  color: "secondary.main",
                },
              }}
            />
          }
          label="Set default"
        />

        {/* Google Maps hiển thị vị trí theo địa chỉ */}
        <iframe
          src={mapSrc}
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </Box>

      <Box
        sx={{
          position: "sticky",
          bottom: 0,
          left: 0,
          right: 0,
          px: 2,
          py: 2,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          borderTop: "1px solid silver",
          bgcolor: "white",
        }}
      >
        <Button onClick={handleClose} color="inherit" variant="contained">
          Cancel
        </Button>
        <Button
          disabled={!isFormValid}
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
