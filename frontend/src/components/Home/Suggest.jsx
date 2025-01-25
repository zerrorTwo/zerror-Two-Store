import {
  Box,
  Button,
  Divider,
  Grid2,
  Typography,
  useTheme,
} from "@mui/material";
import ProductMini from "../ProductMini";
import { Link } from "react-router-dom";

const data = [
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/e8e69c1b040cc51bfc480613ef7bcd5c.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/p/16c398947f066ec2729e61465b850e89.jpg_400x400q80.jpg_.avif",
  "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
];

function Suggest() {
  const theme = useTheme();
  return (
    <Box pt={2} pb={5}>
      {/* Header */}
      <Box
        sx={{
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          pt: 1.5,
          textAlign: "center",
          //   top: "72px",
          //   position: "sticky",
          bgcolor: theme.palette.primary.main,
          zIndex: 10000,
        }}
      >
        <Typography
          variant="h6"
          textTransform={"uppercase"}
          sx={{ color: theme.palette.secondary.main, pb: 1 }}
        >
          Daily discover
        </Typography>
        <Divider
          sx={{
            height: "4px",
            bgcolor: theme.palette.secondary.main,
          }}
        />
      </Box>

      {/* Content */}
      <Box mt={2}>
        <Grid2 container spacing={1.5}>
          {data.map((item, index) => (
            <ProductMini key={index} img={item} />
          ))}
        </Grid2>
      </Box>

      {/* Footer */}
      <Box justifyContent={"center"} display={"flex"} mt={4}>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            display: "block",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 10 }}
          >
            See more
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default Suggest;
