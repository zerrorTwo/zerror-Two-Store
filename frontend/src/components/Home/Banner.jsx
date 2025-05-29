import CardMedia from "@mui/material/CardMedia";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Link } from "react-router-dom";

const itemData = [
  "/Assets/Banner/banner1.jpg",
  "/Assets/Banner/banner2.jpg",
  "/Assets/Banner/banner3.jpg",
  "/Assets/Banner/banner4.jpg",
];
function Banner() {
  return (
    <ImageList
      sx={{
        width: "100%",
        height: "100%",
      }}
      cols={2}
      gap={8} // Thêm khoảng cách giữa các item
    >
      {itemData.map((item, index) => (
        <ImageListItem key={index}>
          <Link
            to="/"
            style={{
              textDecoration: "none", // Bỏ gạch chân
              width: "100%",
              height: "250px",
              display: "block", // Đảm bảo `Link` bao phủ toàn bộ item
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: "100%",
                width: "100%",
                objectFit: "cover", // Đảm bảo hình ảnh hiển thị đẹp
                borderRadius: "8px", // Thêm bo góc nếu cần
              }}
              alt="Banner image"
              image={item}
              loading="lazy"
            />
          </Link>
        </ImageListItem>
      ))}
    </ImageList>
  );
}

export default Banner;
