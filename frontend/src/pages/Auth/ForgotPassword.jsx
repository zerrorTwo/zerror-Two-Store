import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

function ForgotPassword() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isGmailValid, setIsGmailValid] = useState(true);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();
  const [forgotPassword, { isLoading: isLoadingForgot }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isLoadingReset }] =
    useResetPasswordMutation();

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
    const gmailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    setIsGmailValid(gmailRegex.test(value));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your Gmail address");
      return;
    }
    if (!isGmailValid) {
      toast.error("Please enter a valid Gmail address");
      return;
    }
    try {
      const result = await forgotPassword({ email: email }).unwrap();
      toast.success(
        result.message || "A reset email has been sent to your Gmail!"
      );
      setIsEmailSent(true);
      setResendCooldown(60);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to send reset email"
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode || !newPassword) {
      toast.error("Please enter the reset code and new password");
      return;
    }
    try {
      const result = await resetPassword({
        email,
        resetCode,
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
                Enter your Gmail address to receive a password reset email.
              </Typography>
              <Box
                component="form"
                onSubmit={handleSendEmail}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  placeholder="Enter your Gmail"
                  fullWidth
                  required
                  autoFocus
                  value={email}
                  onChange={handleEmailInput}
                  error={!isGmailValid && email.length > 0}
                  helperText={
                    !isGmailValid && email.length > 0
                      ? "Invalid Gmail format"
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
                  disabled={isLoadingForgot || !email || !isGmailValid}
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
                    "Send Reset Email"
                  )}
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                A reset code has been sent to {email}. Enter the code and your
                new password below.
              </Typography>
              <Box
                component="form"
                onSubmit={handleResetPassword}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  placeholder="Enter reset code"
                  fullWidth
                  required
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  placeholder="Enter new password"
                  fullWidth
                  required
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isLoadingReset || !resetCode || !newPassword}
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
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link to="/login">Back to Login</Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ForgotPassword;
