import {
  Avatar,
  Box,
  Button,
  Container,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router";
import theme from "../../theme";

function Register() {
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
          Sign Up
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            placeholder="Enter your username"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
          />
          <TextField
            placeholder="Enter your gmail"
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            sx={{ mb: 2 }}
            placeholder="Enter password"
            fullWidth
            required
            type="password"
          />
          <TextField
            placeholder="Enter comfirm password"
            fullWidth
            required
            type="password"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Sign Up
          </Button>
        </Box>
        <Grid2 container justifyContent="space-between" sx={{ mt: 1 }}>
          <Grid2 item>
            <Link to="/login">Have account? SignIn</Link>
          </Grid2>
        </Grid2>
      </Paper>
    </Container>
  );
}

export default Register;
