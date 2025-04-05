import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "../../redux/api/authApiSlice";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Tooltip } from "@mui/material";

function ForgotPassword() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const [forgotPassword, { isLoading: isLoadingForgot }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isLoadingReset }] =
    useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(
        () => setResendCooldown((prev) => prev - 1),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleEmailInput = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    setIsEmailValid(emailRegex.test(value));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!isEmailValid) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const result = await forgotPassword({ email: email }).unwrap();
      toast.success(
        result.message || "A code email has been sent to your email!"
      );
      setIsEmailSent(true);
      setResendCooldown(60);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to send code email"
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code || !newPassword) {
      toast.error("Please enter the code and new password");
      return;
    }
    try {
      const result = await resetPassword({
        email,
        code,
        newPassword,
      }).unwrap();
      toast.success(result.message || "Password reset successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to reset password"
      );
    }
  };

  const handleRetryEmail = () => {
    setIsEmailSent(false);
    setEmail("");
    setCode("");
    setNewPassword("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0e0e0, #FF8534)",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ position: "absolute", top: 16, left: 16 }}>
          <Tooltip title="Back to login">
            <IconButton onClick={() => navigate("/login")}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Paper elevation={10} sx={{ p: 3, borderRadius: 4 }}>
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Forgot Password
          </Typography>
          {!isEmailSent ? (
            <>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Enter your email address to receive a password code email.
              </Typography>
              <Box
                component="form"
                onSubmit={handleSendEmail}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  placeholder="Enter your email"
                  fullWidth
                  required
                  autoFocus
                  value={email}
                  onChange={handleEmailInput}
                  autoComplete="gmail"
                  error={!isEmailValid && email.length > 0}
                  helperText={
                    !isEmailValid && email.length > 0
                      ? "Invalid email format"
                      : ""
                  }
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
                  disabled={isLoadingForgot || !email || !isEmailValid}
                  sx={{
                    mt: 1,
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.common.white,
                    "&:hover": { bgcolor: theme.palette.secondary.dark },
                  }}
                >
                  {isLoadingForgot ? (
                    <CircularProgress color="inherit" size={25} />
                  ) : (
                    "Send Code Email"
                  )}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                A code has been sent to {email}. Enter the code and your new
                password below.
              </Typography>

              <TextField
                label="Email"
                value={email}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />

              <Box
                component="form"
                onSubmit={handleResetPassword}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  autoComplete="off"
                  placeholder="Enter code"
                  fullWidth
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  sx={{ mb: 2 }}
                  name="randomCodeName"
                />
                <TextField
                  placeholder="Enter new password"
                  fullWidth
                  required
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ mb: 2 }}
                  autoComplete="off"
                  name="randomNewPasswordName"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoadingReset || !code || !newPassword}
                  sx={{
                    mt: 1,
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.common.white,
                    "&:hover": { bgcolor: theme.palette.secondary.dark },
                  }}
                >
                  {isLoadingReset ? (
                    <CircularProgress color="inherit" size={25} />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
                <Button
                  variant="text"
                  onClick={handleSendEmail}
                  disabled={resendCooldown > 0 || isLoadingForgot}
                  sx={{ mt: 1 }}
                >
                  {isLoadingForgot ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : resendCooldown > 0 ? (
                    `Resend in ${resendCooldown}s`
                  ) : (
                    "Resend Code"
                  )}
                </Button>
              </Box>
            </>
          )}
          {isEmailSent ? (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
              <Button variant="text" onClick={handleRetryEmail} sx={{ mt: 1 }}>
                Enter a Different Email
              </Button>
            </Box>
          ) : null}
        </Paper>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
