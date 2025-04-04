import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRegisterMutation } from "../../redux/api/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import {
  useSendVerificationEmailMutation,
  useLazyVerifyGmailQuery,
} from "../../redux/api/mailSlice";

function Register() {
  const [userName, setUsername] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isGmailValid, setIsGmailValid] = useState(true);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const [sendCode, { isLoading: isLoadingCode }] =
    useSendVerificationEmailMutation();
  const [triggerVerifyGmail, { isLoading: isLoadingVerify }] =
    useLazyVerifyGmailQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!isGmailValid) {
      toast.error("Please enter a valid Gmail address");
      return;
    }
    try {
      const data = await register({
        userName,
        email: gmail,
        password,
      }).unwrap();
      dispatch(setCredentials(data));
      const { user, accessToken } = data;
      const expires = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      localStorage.setItem("userInfo", JSON.stringify({ user, expires }));
      localStorage.setItem(
        "token",
        JSON.stringify({ token: accessToken, expires })
      );
      toast.success("Account created! Please verify your email.");
      setIsAccountCreated(true);
      setResendCooldown(60);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to create account"
      );
    }
  };

  const handleResendCode = async () => {
    try {
      await sendCode({ gmail }).unwrap();
      toast.success("Verification code resent!");
      setResendCooldown(60);
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || "Failed to resend verification code"
      );
    }
  };

  const handleVerifyCode = async () => {
    try {
      const result = await triggerVerifyGmail({
        gmail,
        code: confirmCode,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Email verified successfully!");
        navigate("/");
      } else {
        toast.error("Invalid verification code");
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to verify code");
    }
  };

  const handleUserNameInput = (e) => setUsername(e.target.value);
  const handleGmailInput = (e) => {
    const value = e.target.value;
    setGmail(value);
    const gmailRegex = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    setIsGmailValid(gmailRegex.test(value));
  };
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleConfirmPwdInput = (e) => setConfirmPassword(e.target.value);
  const handleConfirmCodeInput = (e) => setConfirmCode(e.target.value);

  const canSubmit = userName && gmail && password && confirmPassword;
  const canVerify = confirmCode && isAccountCreated;

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
          <Avatar
            sx={{
              mx: "auto",
              mb: 2,
              width: 56,
              height: 56,
              "& .MuiSvgIcon-root": { color: "white" },
            }}
          />
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              onChange={handleUserNameInput}
              placeholder="Enter your username"
              fullWidth
              required
              autoFocus
              variant="outlined"
              disabled={isAccountCreated}
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
              placeholder="Enter your Gmail"
              fullWidth
              required
              type="email"
              variant="outlined"
              error={!isGmailValid && gmail}
              helperText={!isGmailValid && gmail ? "Invalid Gmail format" : ""}
              disabled={isAccountCreated}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: theme.palette.text.primary,
                  },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: gmail && !isGmailValid ? "red" : undefined,
                },
              }}
            />
            <TextField
              onChange={handlePwdInput}
              placeholder="Enter password"
              fullWidth
              required
              type="password"
              variant="outlined"
              disabled={isAccountCreated}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: theme.palette.text.primary,
                  },
              }}
            />
            <TextField
              onChange={handleConfirmPwdInput}
              placeholder="Confirm password"
              fullWidth
              required
              type="password"
              variant="outlined"
              disabled={isAccountCreated}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: theme.palette.text.primary,
                  },
              }}
            />
            {!isAccountCreated && (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading || !canSubmit}
                sx={{
                  mt: 1,
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.common.white,
                  "&:hover": { bgcolor: theme.palette.secondary.dark },
                }}
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={25} />
                ) : (
                  "Sign Up"
                )}
              </Button>
            )}
          </Box>

          {isAccountCreated && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                A verification code has been sent to {gmail}. Please enter it
                below.
              </Typography>
              <TextField
                onChange={handleConfirmCodeInput}
                placeholder="Enter verification code"
                fullWidth
                required
                variant="outlined"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: theme.palette.text.primary,
                    },
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleVerifyCode}
                disabled={!canVerify || isLoadingVerify}
                sx={{
                  mb: 2,
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.common.white,
                  "&:hover": { bgcolor: theme.palette.secondary.dark },
                }}
              >
                {isLoadingVerify ? (
                  <CircularProgress color="inherit" size={25} />
                ) : (
                  "Verify Code"
                )}
              </Button>
              <Button
                variant="text"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || isLoadingCode}
                sx={{
                  color:
                    resendCooldown > 0 || isLoadingCode
                      ? "#757575"
                      : "primary.main",
                }}
              >
                {isLoadingCode ? (
                  <CircularProgress color="inherit" size={20} />
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  "Resend Code"
                )}
              </Button>
            </Box>
          )}

          <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
            <Grid item>
              <Button
                variant="text"
                sx={{ color: "primary.main" }}
                onClick={() => navigate("/login")}
              >
                Have an account? Sign In
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
