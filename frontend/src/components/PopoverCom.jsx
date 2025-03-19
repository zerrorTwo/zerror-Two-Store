import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {
  Box,
  TextField,
  Button,
  useTheme,
  LinearProgress,
} from "@mui/material";
import { useUpdateUserMutation } from "../redux/api/userSlice.js"; // Điều chỉnh đường dẫn import
import { toast } from "react-toastify";

function PopoverCom({ anchorEl = null, handleClose, row = null }) {
  const theme = useTheme();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Khai báo mutation hook ở cấp cao nhất của component
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    number: "",
  });

  useEffect(() => {
    if (row) {
      setFormData({
        userName: row.userName || "",
        email: row.email || "",
        number: row.number || "N/A",
      });
    }
  }, [row]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let { userName, email, number } = formData;
      if (number === "N/A") {
        number = "";
      }

      // Gọi mutation
      const respone = await updateUser({
        id: row._id,
        userName,
        email,
        number,
      }).unwrap();

      if (respone) {
        toast.success("User updated successfully");
      }
      // Đóng popover sau khi update thành công
      handleClose();

      // Có thể thêm thông báo success ở đây
    } catch (error) {
      toast.error("Failed to update user", error);
      // Xử lý error - có thể hiển thị thông báo lỗi
    }
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
        {isLoading && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress color="inherit" />
          </Box>
        )}
        <Typography variant="h6" sx={{ color: theme.palette.text.blackColor }}>
          Edit User
        </Typography>
        <Box>
          <TextField
            sx={{
              "& .MuiInputBase-input": {
                color: theme.palette.text.blackColor,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.blackColor,
                "&.Mui-focused": {
                  color: theme.palette.text.blackColor,
                },
                "&.MuiInputLabel-shrink": {
                  color: theme.palette.text.blackColor,
                },
              },
            }}
            fullWidth
            margin="normal"
            label="Username"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <TextField
            sx={{
              "& .MuiInputBase-input": {
                color: theme.palette.text.blackColor,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.blackColor,
                "&.Mui-focused": {
                  color: theme.palette.text.blackColor,
                },
                "&.MuiInputLabel-shrink": {
                  color: theme.palette.text.blackColor,
                },
              },
            }}
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <TextField
            sx={{
              "& .MuiInputBase-input": {
                color: theme.palette.text.blackColor,
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.text.blackColor,
                "&.Mui-focused": {
                  color: theme.palette.text.blackColor,
                },
                "&.MuiInputLabel-shrink": {
                  color: theme.palette.text.blackColor,
                },
              },
            }}
            fullWidth
            margin="normal"
            label="Phone Number"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              // sx={{ backgroundColor: theme.palette.button.backgroundColor }}
              disabled={isLoading}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Popover>
  );
}

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
