import { Typography, Box } from "@mui/material";
// import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlaceIcon from "@mui/icons-material/Place";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import PropTypes from "prop-types"; // Import PropTypes
function AddressItem({ id, selected, setSelectedAddress }) {
  return (
    <Box
      p={2}
      sx={{
        border: selected ? "2px solid #05a" : "2px solid #e0e0e0", // Apply red border if selected
        borderRadius: 2,
        cursor: "pointer",
      }}
      onClick={() => setSelectedAddress(id)} // Toggle selected address
    >
      {/* Header  */}
      <Box display={"flex"} gap={1} alignItems={"center"}>
        <Box display={"flex"} alignItems={"center"}>
          {/* <FormControlLabel
            sx={{ mr: 0 }}
            control={
              <Checkbox
                icon={
                  <RadioButtonUncheckedIcon
                    sx={{
                      color: "#05a",
                    }}
                  />
                }
                checkedIcon={
                  <CheckCircleIcon
                    sx={{
                      color: "#05a",
                      "&.Mui-checked": {
                        color: "#05a",
                      },
                    }}
                  />
                }
              />
            }
          /> */}
          <Typography
            color="common.black"
            variant="body1"
            display="flex"
            alignItems="center"
            gap={0.5}
          >
            <ContactPhoneIcon sx={{ color: "text.primary" }} fontSize="20px" />
            Le Quoc Nam
          </Typography>
        </Box>
        <Typography color="common.black" variant="body1">
          0372364243
        </Typography>
      </Box>

      {/* Content  */}
      <Box display={"flex"}>
        <Typography
          gap={0.5}
          color="common.black"
          variant="body2"
          alignItems={"center"}
        >
          <PlaceIcon sx={{ color: "text.primary" }} fontSize="20px" />
          ktx khu b đhqg Postcode: Hồ Chí Minh - Thành Phố Thủ Đức - Phường Linh
          Trung
        </Typography>
      </Box>
      {/* Footer */}
    </Box>
  );
}

AddressItem.propTypes = {
  id: PropTypes.number.isRequired, // Validate 'id' as a required number
  selected: PropTypes.bool.isRequired, // Validate 'selected' as a required boolean
  setSelectedAddress: PropTypes.func.isRequired, // Validate 'setSelectedAddress' as a required function
};
// Component cha sử dụng AddressDrawer
export default AddressItem;
