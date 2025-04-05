import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import {
  useLazySendVerificationEmailQuery,
  useLazyVerifyEmailQuery,
} from "../../redux/api/mailSlice";

function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || "";

  const [triggerSendCode, { isFetching: isLoadingCode }] =
    useLazySendVerificationEmailQuery();
  const [triggerVerifyEmail, { isFetching: isLoadingVerify }] =
    useLazyVerifyEmailQuery();

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(
        () => setResendCooldown((prev) => prev - 1),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleEmailSubmit = async () => {
    if (!email) return toast.error("Please enter a valid email address");

    try {
      await triggerSendCode({ email }).unwrap();
      toast.success("Verification code sent!");
      setIsEmailSubmitted(true);
      setResendCooldown(60);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to send code");
    }
  };

  const handleVerify = async () => {
    if (!code) return toast.error("Please enter the verification code");

    try {
      const result = await triggerVerifyEmail({ email, code }).unwrap();
      if (result.success) {
        toast.success(result.message || "Email verified successfully!");
        navigate("/login");
      } else {
        toast.error("Invalid verification code");
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to verify code");
    }
  };

  const handleResendCode = async () => {
    try {
      await triggerSendCode({ email }).unwrap();
      toast.success("Verification code resent!");
      setResendCooldown(60);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to resend code");
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
            Verify Your Email
          </Typography>

          {!isEmailSubmitted ? (
            <>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Please enter your email address to receive a verification code.
              </Typography>
              <TextField
                placeholder="Enter your email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleEmailSubmit}
                disabled={!email || isLoadingCode}
              >
                {isLoadingCode ? (
                  <CircularProgress color="inherit" size={25} />
                ) : (
                  "Send Code"
                )}
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                A verification code has been sent to {email}. Please enter it
                below.
              </Typography>
              <TextField
                placeholder="Enter verification code"
                fullWidth
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleVerify}
                disabled={!code || isLoadingVerify}
                sx={{ mb: 2 }}
              >
                {isLoadingVerify ? (
                  <CircularProgress color="inherit" size={25} />
                ) : (
                  "Verify"
                )}
              </Button>
              <Button
                variant="text"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isLoadingCode}
              >
                {isLoadingCode ? (
                  <CircularProgress color="inherit" size={20} />
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  "Resend Code"
                )}
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default VerifyEmail;
