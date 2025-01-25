import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Correct import from react-router-dom
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Swiper, SwiperSlide } from "swiper/react"; // Import Swiper and SwiperSlide from swiper/react
import { Navigation, Autoplay } from "swiper/modules"; // Import required Swiper modules
import "swiper/css"; // Import necessary Swiper CSS files
import "swiper/css/navigation";
import "swiper/css/autoplay";
import ProductMini from "../ProductMini";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

function FlashSale() {
  const theme = useTheme();
  const targetTime = new Date().getTime() + 3600 * 1000; // 1 hour from now

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // Calculate the time left
  function calculateTimeLeft() {
    const currentTime = new Date().getTime();
    const difference = targetTime - currentTime;

    let time = {};
    if (difference > 0) {
      time = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      time = { hours: 0, minutes: 0, seconds: 0 }; // Time's up
    }
    return time;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Clean up timer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    "https://img.lazcdn.com/g/ff/kf/S0ba618100979429ba3befebb24eddc71W.jpg_400x400q80.jpg_.avif",
  ];

  return (
    <Box>
      {/* Box content */}
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Box display={"flex"} alignItems={"center"} gap={2}>
          <Box
            sx={{
              backgroundImage:
                "url(https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/flashsale/fb1088de81e42c4e5389.png)",
              backgroundSize: "contain", // Đảm bảo ảnh bao phủ toàn bộ Box
              backgroundPosition: "center", // Canh giữa ảnh
              height: "30px", // Chiều cao Box (tùy chỉnh theo ý bạn)
              width: "8.125rem", // Chiều rộng Box
              backgroundRepeat: "no-repeat",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          <Box
            sx={{
              display: "flex",
              gap: "4px",
              alignItems: "center",
              fontSize: "1rem",
            }}
          >
            {/* Hiển thị giờ */}
            <Typography
              sx={{
                backgroundColor: "#FF424F",
                color: "white",
                borderRadius: "4px",
                padding: "0 8px",
              }}
            >
              {timeLeft.hours?.toString().padStart(2, "0") || "00"}
            </Typography>
            :{/* Hiển thị phút */}
            <Typography
              sx={{
                backgroundColor: "#FF424F",
                color: "white",
                borderRadius: "4px",
                padding: "0 8px",
              }}
            >
              {timeLeft.minutes?.toString().padStart(2, "0") || "00"}
            </Typography>
            :{/* Hiển thị giây */}
            <Typography
              sx={{
                backgroundColor: "#FF424F",
                color: "white",
                borderRadius: "4px",
                padding: "0 8px",
              }}
            >
              {timeLeft.seconds?.toString().padStart(2, "0") || "00"}
            </Typography>
          </Box>
        </Box>

        <Link
          to="/"
          style={{
            textDecoration: "none", // Remove underline from Link
            color: theme.palette.secondary.main, // Set color text to primary color
            display: "flex",
          }}
        >
          <Typography variant="body1">View All</Typography>
          <NavigateNextIcon sx={{ color: theme.palette.secondary.main }} />{" "}
          {/* Icon for right arrow */}
        </Link>
      </Box>

      <Divider sx={{ my: 1 }} />

      {/* Box carousel */}
      <Box overflow={"visible"} position={"relative"}>
        <Swiper
          navigation={{
            prevEl: ".swiper-button-prev-flashsale",
            nextEl: ".swiper-button-next-flashsale",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          slidesPerView={6}
          spaceBetween={12.5}
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            paddingBottom: "10px",
            paddingLeft: "4px",
            paddingRight: "4px",
          }}
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <ProductMini img={item} />
            </SwiperSlide>
          ))}
        </Swiper>
        <IconButton
          className="swiper-button-prev-flashsale"
          sx={{
            bgcolor: "common.white",
            zIndex: 1000,
            position: "absolute",
            top: "50%",
            left: "-10px",
            transform: "translateY(-50%)",
            "&:hover": {
              bgcolor: "common.white",
              scale: 1.4,
            },
            width: "30px",
            height: "30px",
            transition: "all .1s cubic-bezier(.4,0,.6,1)",
            boxShadow: "0 1px 12px 0 rgba(0,0,0,.12)",
          }}
        >
          <ArrowBackIosIcon sx={{ fontSize: "14px" }} />
        </IconButton>

        <IconButton
          className="swiper-button-next-flashsale"
          sx={{
            bgcolor: "common.white",
            zIndex: 1000,
            position: "absolute",
            top: "50%",
            right: "-10px",
            transform: "translateY(-50%)",
            "&:hover": {
              bgcolor: "common.white",
              scale: 1.4,
            },
            width: "30px",
            height: "30px",
            transition: "all .1s cubic-bezier(.4,0,.6,1)",
            boxShadow: "0 1px 12px 0 rgba(0,0,0,.12)",
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: "14px" }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export default FlashSale;
