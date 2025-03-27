import  Box  from "@mui/material/Box";
import  Button  from "@mui/material/Button";
import  CardMedia  from "@mui/material/CardMedia";
import  Container  from "@mui/material/Container";
import  Divider  from "@mui/material/Divider";
import  TextField  from "@mui/material/TextField";
import  Typography  from "@mui/material/Typography";
import  {useTheme}  from "@mui/material/styles";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";

function Footer() {
  const theme = useTheme();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      <Divider sx={{ height: 2, bgcolor: theme.palette.secondary.main }} />
      <Box
        sx={{
          py: 2,
        }}
      >
        <Container>
          {/* footer part 1 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              pb: 2,
            }}
          >
            <Box
              sx={{
                py: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box display={"flex"}>
                <CardMedia
                  component="img"
                  image="/Assets/haha.png"
                  alt="Logo"
                  sx={{
                    borderRadius: "50%",
                    height: { xs: "30px", md: "30px" },
                    width: "auto",
                    mr: 1,
                  }}
                />
                <Typography
                  sx={{ color: theme.palette.text.primary }}
                  fontWeight={"bold"}
                  variant="h6"
                  textTransform={"uppercase"}
                >
                  High-quality products
                </Typography>
              </Box>
              <Button
                onClick={scrollToTop}
                endIcon={<KeyboardArrowUpIcon />}
                variant="outlined"
                sx={{
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.text.primary}`,
                }}
              >
                Back to top
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                sx={{ color: theme.palette.text.primary }}
                variant="body2"
              >
                We are here for you 24/7
              </Typography>
              <Divider
                orientation="vertical"
                sx={{
                  width: 2,
                  height: "20px",
                  bgcolor: theme.palette.text.primary,
                }}
              />
              <Typography
                sx={{ color: theme.palette.text.primary }}
                variant="body2"
              >
                Facebook: Lê Quốc Nam
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />

          {/* footer part 2 */}
          <Box
            sx={{
              py: 2,
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
            }}
          >
            <Box display={"flex"} alignItems={"center"}>
              <CardMedia
                component="img"
                image="/Assets/delivery.png"
                alt="Box"
                sx={{
                  height: { xs: "30px", md: "30px" },
                  width: "auto",
                  mr: 1,
                }}
              />
              <Typography
                sx={{ color: theme.palette.text.primary }}
                variant="body2"
                textTransform={"uppercase"}
              >
                Fast delivery
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <CardMedia
                component="img"
                image="/Assets/24-hours-support.png"
                alt="Box"
                sx={{
                  height: { xs: "30px", md: "30px" },
                  width: "auto",
                  mr: 1,
                }}
              />
              <Typography
                sx={{ color: theme.palette.text.primary }}
                variant="body2"
                textTransform={"uppercase"}
              >
                Support 24/7
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <CardMedia
                component="img"
                image="/Assets/payment-method.png"
                alt="Box"
                sx={{
                  height: { xs: "30px", md: "30px" },
                  width: "auto",
                  mr: 1,
                }}
              />
              <Typography
                sx={{ color: theme.palette.text.primary }}
                variant="body2"
                textTransform={"uppercase"}
              >
                Immediate payment
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <CardMedia
                component="img"
                image="/Assets/exchange.png"
                alt="Box"
                sx={{
                  height: { xs: "30px", md: "30px" },
                  width: "auto",
                  mr: 1,
                }}
              />
              <Typography
                sx={{ color: theme.palette.text.primary }}
                variant="body2"
                textTransform={"uppercase"}
              >
                7-day return policy
              </Typography>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <CardMedia
                component="img"
                image="/Assets/warranty.png"
                alt="Box"
                sx={{
                  height: { xs: "30px", md: "30px" },
                  width: "auto",
                  mr: 1,
                }}
              />
              <Typography
                sx={{ color: theme.palette.text.primary }}
                variant="body2"
                textTransform={"uppercase"}
              >
                Guarantee of originality
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />

          {/* footer part 3 */}
          <Box
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <Box>
              <Box display={"flex"} gap={2} alignItems={"center"}>
                <Typography
                  sx={{ color: theme.palette.text.primary }}
                  variant="body2"
                  textTransform={"uppercase"}
                >
                  Contact us:
                </Typography>
                <Box display={"flex"} gap={2}>
                  <Link to={"/"}>
                    <TwitterIcon
                      fontSize="large"
                      sx={{
                        pt: 1,
                        fill: "#1DA1F2", // Màu xanh của Twitter
                      }}
                    />
                  </Link>
                  <Link to={"/"}>
                    <LinkedInIcon
                      fontSize="large"
                      sx={{
                        pt: 1,
                        fill: "#0077B5", // Màu xanh của LinkedIn
                      }}
                    />
                  </Link>
                  <Link to={"/"}>
                    <FacebookIcon
                      fontSize="large"
                      sx={{
                        pt: 1,
                        fill: "#1877F2", // Màu xanh của Facebook
                      }}
                    />
                  </Link>
                  <Link to={"/"}>
                    <GitHubIcon
                      fontSize="large"
                      sx={{
                        pt: 1,
                        fill: "#333", // Màu đen của GitHub
                      }}
                    />
                  </Link>
                </Box>
              </Box>
              <Box my={2}>
                <Typography
                  sx={{ color: theme.palette.text.primary }}
                  variant="body1"
                  fontWeight={"bold"}
                  textTransform={"uppercase"}
                >
                  Discover and buy carefully selected products online. <br />
                  Read reviews to help you choose
                </Typography>
                <Box height={10}></Box>
                <Typography
                  sx={{ color: theme.palette.text.primary }}
                  variant="body2"
                  textTransform={"uppercase"}
                >
                  &copy; 2025 High-quality products. All rights reserved.
                </Typography>
              </Box>
            </Box>
            <Box
              display={"flex"}
              gap={2}
              alignItems={"center"}
              flexDirection={{ xs: "column" }}
            >
              <TextField
                sx={{
                  width: "300px",
                  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: theme.palette.text.primary,
                    },
                }}
                autoComplete="email"
                placeholder="Enter your gmail to support"
              />
              <Button
                variant="outlined"
                sx={{
                  color: theme.palette.text.primary,
                  border: `1px solid ${theme.palette.text.primary}`,
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Footer;
