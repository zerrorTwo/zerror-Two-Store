import { CardMedia, ImageList, ImageListItem } from "@mui/material";
import { Link } from "react-router-dom"; // Đúng import từ react-router-dom

const itemData = [
  "https://cf.shopee.vn/file/sg-11134258-7ra21-m53ulphtuzim81_xhdpi",
  "https://cf.shopee.vn/file/sg-11134258-7ra1b-m54676okjkao59_xhdpi",
  "https://img.pikbest.com/origin/10/01/82/867pIkbEsTAIq.png!w700wp",
  "https://cf.shopee.vn/file/sg-11134258-7ra21-m53ulphtuzim81_xhdpi",
];

function Banner() {
  return (
    <ImageList
      sx={{
        width: "100%",
        height: "308px",
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
              height: "150px",
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
