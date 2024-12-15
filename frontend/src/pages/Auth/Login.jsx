import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
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

function Login() {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login({ email: gmail, password }).unwrap();

      dispatch(setCredentials(data));
      navigate("/"); // This will navigate to the homepage if login is successful
    } catch (err) {
      console.log(err);

      toast.error(err.data.message);
    }
  };

  const handleGmailInput = (e) => setGmail(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);

  return (
    <Container maxWidth="xs">
      <Paper elevation={10} sx={{ marginTop: 8, padding: 2 }}>
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: theme.palette.primary.main,
            textAlign: "center",
            mb: 1,
          }}
        ></Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Sign In
        </Typography>
        <Box onSubmit={handleSubmit} component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            placeholder="Enter your gmail"
            onChange={handleGmailInput}
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            placeholder="Enter password"
            fullWidth
            required
            type="password"
            onChange={handlePwdInput}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            {isLoading ? (
              <CircularProgress color="inherit" size={25} />
            ) : (
              "Login"
            )}
          </Button>
        </Box>
        <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
          <Grid item>
            <Link to="/forgot">Forgot password?</Link>
          </Grid>
          <Grid item>
            <Link to="/register">Sign Up</Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Login;
