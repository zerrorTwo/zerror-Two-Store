import PropTypes from "prop-types";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { Box, TextField, Button, useTheme } from "@mui/material";

// Sử dụng default parameters thay vì defaultProps
function PopoverCom({ anchorEl = null, handleClose, row = null }) {
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleSubmit = (event) => {
    event.preventDefault();
    // Xử lý logic update user ở đây
    handleClose();
  };

  return (
    <Popover
      anchorReference="anchorPosition"
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
      id={id}
      open={open}
      anchorPosition={{
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
      }}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Box sx={{ p: 2, width: 300 }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.blackColor }}>
          Edit User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            sx={{
              "& .MuiInputBase-input": {
                color: theme.palette.text.blackColor,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.blackColor,
                // Khi label được focus
                "&.Mui-focused": {
                  color: theme.palette.text.blackColor, // giữ màu đỏ khi focus
                },
                // Khi label bị shrink (thu nhỏ)
                "&.MuiInputLabel-shrink": {
                  color: theme.palette.text.blackColor, // giữ màu đỏ khi shrink
                },
              },
            }}
            fullWidth
            margin="normal"
            label="Username"
            defaultValue={row?.userName}
          />
          <TextField
            sx={{
              "& .MuiInputBase-input": {
                color: theme.palette.text.blackColor,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.blackColor,
                // Khi label được focus
                "&.Mui-focused": {
                  color: theme.palette.text.blackColor, // giữ màu đỏ khi focus
                },
                // Khi label bị shrink (thu nhỏ)
                "&.MuiInputLabel-shrink": {
                  color: theme.palette.text.blackColor, // giữ màu đỏ khi shrink
                },
              },
            }}
            fullWidth
            margin="normal"
            label="Email"
            defaultValue={row?.email}
          />
          <TextField
            sx={{
              "& .MuiInputBase-input": {
                color: theme.palette.text.blackColor,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.blackColor,
                // Khi label được focus
                "&.Mui-focused": {
                  color: theme.palette.text.blackColor, // giữ màu đỏ khi focus
                },
                // Khi label bị shrink (thu nhỏ)
                "&.MuiInputLabel-shrink": {
                  color: theme.palette.text.blackColor, // giữ màu đỏ khi shrink
                },
              },
            }}
            fullWidth
            margin="normal"
            label="Phone Number"
            defaultValue={row?.number || "N/A"}
          />
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: theme.palette.button.backgroundColor }}
            >
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Popover>
  );
}

// Chỉ giữ lại PropTypes validation
PopoverCom.propTypes = {
  anchorEl: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string,
    userName: PropTypes.string,
    email: PropTypes.string,
    number: PropTypes.string,
    isAdmin: PropTypes.bool,
  }),
};

export default PopoverCom;
