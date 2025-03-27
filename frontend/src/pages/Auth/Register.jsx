import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import theme from "../../theme";
import { toast } from "react-toastify"; // Import only toast
import "react-toastify/dist/ReactToastify.css"; // Đảm bảo import CSS của Toastify
import { useState } from "react";
import { useRegisterMutation } from "../../redux/api/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";

function Register() {
  const [userName, setUsername] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const data = await login({
        userName: userName,
        email: gmail,
        password,
      }).unwrap();

      dispatch(setCredentials(data));
      const { user, accessToken } = data;
      const expires = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days from now

      // Store user info with expiration timestamp
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          user,
          expires,
        })
      );
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: accessToken,
          expires,
        })
      );
      navigate("/"); // This will navigate to the homepage if login is successful
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "An unexpected error occurred"
      );
    }
  };

  const handleUserNameInput = (e) => setUsername(e.target.value);
  const handleGmailInput = (e) => setGmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleCofirmPwdInput = (e) => setConfirmPassword(e.target.value);

  return (
    <Box
      sx={{
        backgroundImage: `url("/Assets/background_login.webp")`,
        backgroundSize: "cover", // Ensures the image covers the entire area
        backgroundPosition: "center", // Centers the image
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Ensures it takes the full viewport height
        bgcolor: theme.palette.secondary.main,
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={10} sx={{ padding: 2 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.common.black,
              mx: "auto",
              textAlign: "center",
              mb: 1,
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          ></Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            SignUp
          </Typography>
          <Box
            onSubmit={handleSubmit}
            component="form"
            noValidate
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: theme.palette.text.primary,
                },
            }}
          >
            <TextField
              onChange={handleUserNameInput}
              placeholder="Enter your username"
              fullWidth
              required
              autoFocus
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: theme.palette.text.primary,
                  },
              }}
            />
            <TextField
              onChange={handleGmailInput}
              placeholder="Enter your gmail"
              fullWidth
              required
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: theme.palette.text.primary,
                  },
              }}
            />
            <TextField
              onChange={handlePwdInput}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: theme.palette.text.primary,
                  },
              }}
              placeholder="Enter password"
              fullWidth
              required
              type="password"
            />
            <TextField
              onChange={handleCofirmPwdInput}
              placeholder="Enter comfirm password"
              fullWidth
              required
              type="password"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: theme.palette.text.primary,
                  },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 1,
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.common.white,
              }}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={25} />
              ) : (
                "Sign Up"
              )}
            </Button>
          </Box>
          <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
            <Grid item>
              <Link to="/login">Have account? SignIn</Link>
            </Grid>
          </Grid>

          {/* <Divider sx={{ my: 2 }}>Or</Divider>

        <Grid container justifyContent="space-evenly" sx={{ mt: 2 }}>
          <ButtonWithIcon text="Google" icon="/Assets/google.png" link="/" />
          <ButtonWithIcon
            text="Facebook"
            icon="/Assets/facebook.png"
            link="/"
          />
        </Grid> */}
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
