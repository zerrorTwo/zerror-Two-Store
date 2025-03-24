import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PlaceIcon from "@mui/icons-material/Place";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import PropTypes from "prop-types";

function AddressItem({
  id,
  item,
  selected,
  setSelectedAddress,
  handleOpenPopover,
}) {
  return (
    <Box
      p={2}
      sx={{
        border: selected ? "2px solid #05a" : "2px solid #e0e0e0",
        borderRadius: 2,
        cursor: "pointer",
      }}
      onClick={() => setSelectedAddress(id)}
    >
      {/* Header */}
      <Box display={"flex"} gap={1} alignItems={"center"}>
        <Typography
          color="common.black"
          variant="body1"
          display="flex"
          alignItems="center"
          gap={0.5}
        >
          <ContactPhoneIcon sx={{ color: "text.primary" }} fontSize="20px" />
          {item.name}
        </Typography>
        <Typography color="common.black" variant="body1">
          {item.phone}
        </Typography>
      </Box>

      {/* Content */}
      <Box display={"flex"}>
        <Typography
          gap={0.5}
          color="common.black"
          variant="body2"
          alignItems={"center"}
        >
          <PlaceIcon sx={{ color: "text.primary" }} fontSize="20px" />
          {`${item.street}, ${item.ward?.name}, ${item.district?.name}, ${item.city?.name}`}
        </Typography>
      </Box>

      {/* Footer */}
      <Box display={"flex"} gap={2} mt={1} alignItems={"center"}>
        {item.setDefault && (
          <Box
            borderRadius={2}
            px={2}
            height={"20px"}
            alignItems={"center"}
            border={"1px solid"}
            borderColor={"secondary.main"}
            display={"flex"}
          >
            <Typography
              sx={{ color: "secondary.main", lineHeight: "20px" }}
              variant="caption"
            >
              Default Shipping Address
            </Typography>
          </Box>
        )}

        <Typography
          sx={{ color: "#05a", cursor: "pointer" }}
          variant="text"
          onClick={handleOpenPopover}
        >
          Edit
        </Typography>
      </Box>
    </Box>
  );
}

AddressItem.propTypes = {
  id: PropTypes.string.isRequired, // Sửa lại từ number thành string
  item: PropTypes.object.isRequired, // Thêm prop item
  selected: PropTypes.bool.isRequired,
  setSelectedAddress: PropTypes.func.isRequired,
  handleOpenPopover: PropTypes.func.isRequired,
};

export default AddressItem;
