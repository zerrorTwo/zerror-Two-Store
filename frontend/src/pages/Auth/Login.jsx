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
import { BASE_URL } from "../../redux/constants";

function Login() {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const logout = urlParams.get("logout");
    if (logout) {
      toast.error("Your session has expired, please login again!");
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email: gmail, password }).unwrap();
      dispatch(setCredentials(data));
      navigate("/");
    } catch (err) {
      const errorMessage =
        err?.data?.message || err?.error || "An unexpected error occurred";
      toast.error(errorMessage);
      if (errorMessage === "Email not verified") {
        navigate("/verify-email", { state: { email: gmail } }); // Chuyển hướng tới trang verify
      }
    }
  };

  const handleGmailInput = (e) => setGmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

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
            onSubmit={handleSubmit}
            component="form"
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              autoComplete="email"
              placeholder="Enter your Gmail"
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
                    "& .MuiSvgIcon-root": { color: theme.palette.common.black },
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
                "&:hover": { bgcolor: theme.palette.secondary.dark },
              }}
              disabled={isLoading}
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
