import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Close from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  useCreateUserAddressMutation,
  useLazyGetCityQuery,
  useLazyGetDistrictQuery,
  useLazyGetWardQuery,
} from "../../redux/api/addressSlice";
import { toast } from "react-toastify";

// Constants
const INITIAL_FORM_STATE = {
  name: "",
  phone: "",
  city: null,
  district: null,
  ward: null,
  street: "",
  setDefault: false,
};

const PHONE_REGEX = /^[0-9]{10}$/;
const INITIAL_MAP_SRC =
  "https://maps.google.com/maps?q=Ho%20Chi%20Minh%20City&t=&z=15&ie=UTF8&iwloc=&output=embed";

// Reusable styles
const commonStyles = {
  autocomplete: {
    ".MuiFormLabel-root": {
      color: "black !important",
      lineHeight: "13px",
    },
    ".MuiFormControl-root": {
      height: "40px",
    },
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "text.primary",
      },
    },
    ".MuiInputBase-root": {
      height: "100%",
      pr: "10px !important",
    },
  },
  inputBase: {
    px: 1,
    py: 0.5,
    border: "1px solid silver",
    borderRadius: 1,
    color: "black",
  },
};

function AddressPopover({ handleClose, handleOpenDrawer }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState("");
  const [mapSrc, setMapSrc] = useState(INITIAL_MAP_SRC);

  // API Fetch Hooks
  const [createUserAddress, { isLoading }] = useCreateUserAddressMutation();
  const [getCity, { data: cityData = [], isFetching: loadingCity }] =
    useLazyGetCityQuery();
  const [
    getDistrict,
    { data: districtData = [], isFetching: loadingDistrict },
  ] = useLazyGetDistrictQuery();
  const [getWard, { data: wardData = [], isFetching: loadingWard }] =
    useLazyGetWardQuery();

  // Validation handlers
  const validatePhone = useCallback((value) => {
    if (!/^\d*$/.test(value)) return "Number only!!";
    if (value.length > 10) return "Max 10 number digits!!";
    if (value.length === 10 && !PHONE_REGEX.test(value))
      return "Invalid phone number!!";
    return "";
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      if (field === "phone") {
        setError(validatePhone(value));
      }
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [validatePhone]
  );

  const handleSelectCity = useCallback(
    (value) => {
      setFormData((prev) => ({
        ...prev,
        city: value,
        district: null,
        ward: null,
      }));
      if (value) getDistrict(value.id);
    },
    [getDistrict]
  );

  const handleSelectDistrict = useCallback(
    (value) => {
      setFormData((prev) => ({
        ...prev,
        district: value,
        ward: null,
      }));
      if (value) getWard(value.id);
    },
    [getWard]
  );

  // Map update effect
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
      ].filter(Boolean);

      if (addressParts.length > 0) {
        const query = encodeURIComponent(addressParts.join(", "));
        setMapSrc(
          `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`
        );
      }
    }
  }, [formData.street, formData.ward, formData.district, formData.city]);

  // Form validation
  const isFormValid = useMemo(
    () =>
      formData.name.trim() &&
      PHONE_REGEX.test(formData.phone.trim()) &&
      formData.city &&
      formData.district &&
      formData.ward &&
      formData.street.trim() &&
      !error,
    [formData, error]
  );

  // Computed properties
  const isAddressFieldsDisabled =
    !formData.city || !formData.district || !formData.ward;
  const disabledFieldBackground = {
    bgcolor: isAddressFieldsDisabled ? "#f0f0f0" : "white",
  };

  const handleSubmit = async (event) => {
    if (!isFormValid) {
      toast.error("Vui lòng điền đầy đủ thông tin địa chỉ!!");
      return;
    }

    const addressData = {
      ...formData,
      city: formData.city?._id,
      district: formData.district?._id,
      ward: formData.ward?._id,
    };

    try {
      const success = await createUserAddress({
        data: addressData,
      }).unwrap();
      if (success) {
        toast.success("Thêm địa chỉ thành công!");
        handleClose();
        handleOpenDrawer(event);
      } else {
        toast.error("Không thể thêm địa chỉ, vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
    }
  };

  return (
    <Box
      pt={2}
      px={2}
      display="flex"
      flexDirection="column"
      width="500px"
      bgcolor="white"
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

        {/* Name and Phone Fields */}
        <Box display="flex" gap={2}>
          <InputBase
            required
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            sx={{ ...commonStyles.inputBase, flex: 1 }}
          />
          <TextField
            required
            error={!!error}
            helperText={error}
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            fullWidth
            sx={{
              ...commonStyles.textField,
              ".MuiInputBase-root": {
                maxHeight: "40px",
                boxSizing: "border-box",
              },
              maxHeight: "40px",
              flex: 1,
            }}
          />
        </Box>

        {/* City Autocomplete */}
        <Autocomplete
          sx={commonStyles.autocomplete}
          disablePortal
          fullWidth
          options={cityData}
          getOptionLabel={(option) => option?.name || ""}
          value={formData.city}
          onOpen={() => cityData.length === 0 && getCity()}
          onChange={(_, value) => handleSelectCity(value)}
          loading={loadingCity}
          renderInput={(params) => (
            <TextField
              {...params}
              label="City"
              sx={commonStyles.textField}
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

        {/* District Autocomplete */}
        <Autocomplete
          sx={commonStyles.autocomplete}
          disablePortal
          fullWidth
          options={districtData}
          getOptionLabel={(option) => option?.name || ""}
          value={formData.district}
          onOpen={() => formData.city && getDistrict(formData.city.id)}
          onChange={(_, value) => handleSelectDistrict(value)}
          loading={loadingDistrict}
          disabled={!formData.city}
          renderInput={(params) => (
            <TextField
              {...params}
              label="District"
              sx={{ ...commonStyles.textField, ...disabledFieldBackground }}
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

        {/* Ward Autocomplete */}
        <Autocomplete
          sx={commonStyles.autocomplete}
          disablePortal
          fullWidth
          options={wardData}
          getOptionLabel={(option) => option?.name || ""}
          value={formData.ward}
          onOpen={() => formData.district && getWard(formData.district.id)}
          onChange={(_, value) => handleChange("ward", value)}
          loading={loadingWard}
          disabled={!formData.district}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Ward"
              sx={{ ...commonStyles.textField, ...disabledFieldBackground }}
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

        {/* Street Input */}
        <InputBase
          disabled={isAddressFieldsDisabled}
          required
          placeholder="Street Name, Building, House No."
          value={formData.street}
          onChange={(e) => handleChange("street", e.target.value)}
          sx={{ ...commonStyles.inputBase, ...disabledFieldBackground }}
        />

        {/* Default Checkbox */}
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

        {/* Google Maps */}
        <iframe
          title="Location Map"
          src={mapSrc}
          width="100%"
          height="250"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
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
          disabled={!isFormValid || isLoading}
          onClick={(event) => handleSubmit(event)}
          sx={{ bgcolor: "secondary.main", color: "white" }}
          variant="contained"
        >
          {isLoading ? <CircularProgress size={25} /> : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}

AddressPopover.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleOpenDrawer: PropTypes.func.isRequired,
};

export default AddressPopover;
