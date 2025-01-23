import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import theme from "../../theme";
import { Link, useNavigate } from "react-router-dom"; // Corrected import
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useState } from "react";
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { toast } from "react-toastify"; // Import only toast
import "react-toastify/dist/ReactToastify.css"; // Đảm bảo import CSS của Toastify
import ButtonWithIcon from "../../components/ButtonWIthIcon";
import { BASE_URL } from "../../redux/constants";

function Login() {
  // const urlParams = new URLSearchParams(window.location.search);
  // const logout = urlParams.get("logout");

  // useEffect(() => {
  //   if (logout) {
  //     toast.error("Your session has expired, please login again!!!");
  //   }
  // }, [logout]);
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email: gmail, password }).unwrap();
      console.log(data);

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
      navigate("/");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "An unexpected error occurred"
      );
    }
  };

  const handleGmailInput = (e) => setGmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

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
          />
          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Sign In
          </Typography>
          <Box
            onSubmit={handleSubmit}
            component="form"
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              autoComplete="email"
              placeholder="Enter your gmail"
              onChange={handleGmailInput}
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
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: theme.palette.text.primary,
                  },
              }}
              placeholder="Enter password"
              fullWidth
              required
              type="password"
              onChange={handlePwdInput}
            />
            <FormControlLabel
              control={
                <Checkbox
                  id="remember"
                  sx={{
                    "& .MuiSvgIcon-root": {
                      color: theme.palette.common.black,
                    },
                  }}
                  value="remember"
                  color="primary"
                />
              }
              label="Remember me"
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
                "Login"
              )}
            </Button>
          </Box>
          <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
            <Grid item>
              <Link to="/forgot">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/register">Sign Up</Link>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }}>Or</Divider>

          <Grid container justifyContent="space-evenly" sx={{ mt: 2 }}>
            <ButtonWithIcon
              text="Google"
              icon="/Assets/google.png"
              link={`${BASE_URL}/auth/google/login`}
            />
            <ButtonWithIcon
              text="Facebook"
              icon="/Assets/facebook.png"
              link={`${BASE_URL}/auth/facebook/login`}
            />
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
