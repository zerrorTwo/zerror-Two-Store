import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { selectCurrentUser } from "../redux/features/auth/authSlice.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useUpdateUserMutation } from "../redux/api/userSlice.js";

function Profile() {
  const user = useSelector(selectCurrentUser);
  //   console.log(user);

  const theme = useTheme();
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    email: user?.email || "",
    number: user?.number || "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData?.password !== formData?.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const dataToUpdate = {
        id: user._id,
        ...formData,
      };
      if (!formData.password) {
        delete dataToUpdate.password;
        delete dataToUpdate.confirmPassword;
      }

      await updateUser(dataToUpdate).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        number: user.number || "",
        password: "",
        confirmPassword: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textFieldStyle = {
    "& .MuiInputBase-input": {
      color: theme.palette.text.blackColor,
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.primary,
      "&.Mui-focused": {
        color: theme.palette.text.blackColor,
      },
      "&.MuiInputLabel-shrink": {
        color: theme.palette.text.blackColor,
      },
    },
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <Typography
          component="h1"
          variant="h5"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Edit Profile
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            sx={textFieldStyle}
            fullWidth
            margin="normal"
            label="Username"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <TextField
            sx={textFieldStyle}
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <TextField
            sx={textFieldStyle}
            fullWidth
            margin="normal"
            label="Phone Number"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <TextField
            sx={textFieldStyle}
            fullWidth
            margin="normal"
            label="New Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <TextField
            sx={textFieldStyle}
            fullWidth
            margin="normal"
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={25} />
            ) : (
              "Update Profile"
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
