import { CardMedia, ImageList, ImageListItem } from "@mui/material";
import { Link } from "react-router-dom"; // Đúng import từ react-router-dom

const itemData = [
  "https://shop.huanghanlian.com/_next/image?url=http%3A%2F%2Fhuanghanzhilian-test.oss-cn-beijing.aliyuncs.com%2Fshop%2Fupload%2Fimage%2Fbanners%2FAAR1hdzMBEfpYKym3njGU.jpeg&w=1920&q=100",
  "https://shop.huanghanlian.com/_next/image?url=http%3A%2F%2Fhuanghanzhilian-test.oss-cn-beijing.aliyuncs.com%2Fshop%2Fupload%2Fimage%2Fbanners%2FtHzPZwswSaFdD_3TpdPCt.jpeg&w=1920&q=100",
  "https://shop.huanghanlian.com/_next/image?url=http%3A%2F%2Fhuanghanzhilian-test.oss-cn-beijing.aliyuncs.com%2Fshop%2Fupload%2Fimage%2Fbanners%2FluBUyOForM7vLS8SMMORT.jpeg&w=1920&q=100",
  "https://shop.huanghanlian.com/_next/image?url=http%3A%2F%2Fhuanghanzhilian-test.oss-cn-beijing.aliyuncs.com%2Fshop%2Fupload%2Fimage%2Fbanners%2FAG8T4X-3pFnHc1O2XEeN5.jpeg&w=1920&q=100",
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
