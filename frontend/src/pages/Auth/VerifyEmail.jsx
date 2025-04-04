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
  useSendVerificationEmailMutation,
  useLazyVerifyGmailQuery,
} from "../../redux/api/mailSlice";

function VerifyEmail() {
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [sendCode, { isLoading: isLoadingCode }] =
    useSendVerificationEmailMutation();
  const [triggerVerifyGmail, { isLoading: isLoadingVerify }] =
    useLazyVerifyGmailQuery();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(
        () => setResendCooldown((prev) => prev - 1),
        1000
      );
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    try {
      const result = await triggerVerifyGmail({ gmail: email, code }).unwrap();
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
      await sendCode({ gmail: email }).unwrap();
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
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            A verification code has been sent to {email}. Please enter it below.
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
        </Paper>
      </Container>
    </Box>
  );
}

export default VerifyEmail;
