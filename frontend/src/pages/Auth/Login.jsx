import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, useNavigate, useLocation } from "react-router-dom";
import theme from "../../theme";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/api/authApiSlice";
import ButtonWithIcon from "../../components/ButtonWithIcon";
import { IconButton, InputAdornment, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const logout = urlParams.get("logout");
    const error = urlParams.get("error");
    const accessToken = urlParams.get("accessToken");
    const userEncoded = urlParams.get("user"); // Get the encoded user string

    if (logout) {
      toast.error("Your session has expired, please login again!");
    }
    if (error === "google_login_failed") {
      toast.error("Google login failed. Please try again.");
      navigate("/login", { replace: true });
    }
    if (accessToken && userEncoded) {
      try {
        const userString = decodeURIComponent(userEncoded); // Decode the URL-encoded string
        const parsedUser = JSON.parse(userString); // Parse the JSON string
        dispatch(
          setCredentials({
            user: parsedUser,
            accessToken,
          })
        );
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Error parsing Google login data:", err);
        toast.error("Failed to process Google login.");
        navigate("/login", { replace: true });
      }
    }
  }, [location.search, dispatch, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email, password }).unwrap();
      dispatch(
        setCredentials({
          user: data.user,
          accessToken: data.accessToken,
        })
      );
      navigate("/", { replace: true });
    } catch (err) {
      const errorMessage =
        err?.data?.message || err?.error || "An unexpected error occurred";
      toast.error(errorMessage);
      if (errorMessage === "Email not verified") {
        navigate("/verify-email", { state: { email } });
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/v1/api/auth/google/login";
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #e0e0e0, #FF8534)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ position: "absolute", top: 16, left: 16 }}>
          <Tooltip title="Back to home">
            <IconButton onClick={() => navigate("/")}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Paper elevation={10} sx={{ p: 3, borderRadius: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "silver",
                width: 56,
                height: 56,
                mb: 2,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
              }}
            />
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary" align="center">
              Sign in to continue to your account
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              placeholder="Enter password"
              value={password}
              fullWidth
              required
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: theme.palette.text.primary,
                  },
              }}
            />
            <FormControlLabel
              control={<Checkbox id="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.common.white,
                "&:hover": { bgcolor: theme.palette.secondary.dark },
              }}
              disabled={isLoginLoading}
            >
              {isLoginLoading ? (
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
              onClick={handleGoogleLogin}
            />
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
