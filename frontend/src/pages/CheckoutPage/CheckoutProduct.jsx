import { Grid2, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";

function CheckoutProduct() {
  return (
    <Box>
      <Grid2 container sx={{ alignItems: "center" }}>
        <Grid2 size={6}>
          <Box display="flex" alignItems="center" gap={0}>
            <Box display="flex" flexDirection="row" gap={1} overflow="hidden">
              <CardMedia
                component="img"
                src="https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m5e5ewps2p4o66.webp"
                sx={{ height: "80px", width: "auto", objectFit: "cover" }}
                loading="lazy"
              />
              <Box display="flex" flexDirection="column">
                <Typography
                  variant="body2"
                  sx={{
                    color: "common.black",
                    lineHeight: "20px",
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: 2,
                    textOverflow: "ellipsis",
                    wordBreak: "break-all",
                    maxHeight: "40px",
                    "&:hover": {
                      color: "secondary.main",
                    },
                  }}
                >
                  RACK Kệ Đựng Gia Vị INOX Kệ Gia Vị Công Suất Lớn Kệ Để Dao
                  Thớt Tiết Kiệm Không Gian
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "text.primary",
                  }}
                >
                  Variation: con me may
                </Typography>
                <textarea
                  style={{
                    borderRadius: "2px",
                    height: "20px",
                    padding: "5px",
                  }}
                  placeholder="Message"
                />
              </Box>
            </Box>
          </Box>
        </Grid2>

        <Grid2 size={6}>
          <Grid2 container justifyContent="center" alignItems="center">
            <Grid2 size={4} textAlign="center">
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Typography variant="body1" color="text.secondary">
                  Unit Price
                </Typography>
                <Typography fontWeight="bold" color="secondary.main">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(111111)}
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={5} textAlign="center">
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Typography variant="body1" color="text.secondary">
                  Qty
                </Typography>
                <Typography fontWeight="bold" color="secondary.main">
                  2
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={3} textAlign="center">
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Typography variant="body1" color="text.secondary">
                  Item Subtotal
                </Typography>
                <Typography fontWeight="bold" color="secondary.main">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(111111)}
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default CheckoutProduct;
