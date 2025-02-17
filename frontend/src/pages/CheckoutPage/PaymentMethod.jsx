import { CardMedia, Typography } from "@mui/material";
import Box from "@mui/material/Box";

function PaymentMethod() {
  return (
    <Box
      sx={{
        cursor: "pointer",
        border: "1px solid",
        borderColor: "#05a",
        borderRadius: 1,
        padding: 1,
        background:
          "linear-gradient(90deg, rgba(0,85,170,0.8386204823726365) 0%, rgba(0,85,170,0.6733543759300595) 35%, rgba(0,85,170,0.36243000618216037) 100%)",
      }}
    >
      <Box
        mb={1}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center" gap={1}>
          <CardMedia
            component="img"
            src="https://img.lazcdn.com/g/tps/tfs/TB1ZP8kM1T2gK0jSZFvXXXnFXXa-96-96.png_2200x2200q75.png_.webp"
            sx={{ height: "30px", width: "auto", objectFit: "cover" }}
            loading="lazy"
          />
          <Typography color="common.white" variant="body1">
            Cash on Delivery
          </Typography>
        </Box>
        {/* <FormControlLabel
          control={
            <Checkbox
              icon={
                <RadioButtonUncheckedIcon
                  sx={{
                    color: "#05a",
                  }}
                />
              }
              checkedIcon={
                <CheckCircleIcon
                  sx={{
                    color: "#05a",
                    "&.Mui-checked": {
                      color: "#05a",
                    },
                  }}
                />
              }
            />
          }
        /> */}
      </Box>
      <Typography color="common.white" variant="body2">
        Pay when you receive
      </Typography>
    </Box>
  );
}

// PaymentMethod.propTypes = {
//   anchor: PropTypes.string.isRequired,
//   state: PropTypes.object.isRequired,
//   toggleDrawer: PropTypes.func.isRequired,
// };

export default PaymentMethod;
