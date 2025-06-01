import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
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
import PropTypes from "prop-types";
import useCountdownTimer from "../../hooks/useCountdownTimer";

function FlashSale({ listItem }) {
  const theme = useTheme();
  const timeLeft = useCountdownTimer();

  return (
    <Box>
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
              backgroundSize: "contain",
              backgroundPosition: "center",
              height: "30px",
              width: "8.125rem",
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
            <Typography
              sx={{
                backgroundColor: "#FF424F",
                color: "white",
                borderRadius: "4px",
                padding: "0 8px",
              }}
            >
              {timeLeft.hours.toString().padStart(2, "0")}
            </Typography>
            :
            <Typography
              sx={{
                backgroundColor: "#FF424F",
                color: "white",
                borderRadius: "4px",
                padding: "0 8px",
              }}
            >
              {timeLeft.minutes.toString().padStart(2, "0")}
            </Typography>
            :
            <Typography
              sx={{
                backgroundColor: "#FF424F",
                color: "white",
                borderRadius: "4px",
                padding: "0 8px",
              }}
            >
              {timeLeft.seconds.toString().padStart(2, "0")}
            </Typography>
          </Box>
        </Box>

        <Link
          to="/search"
          style={{
            textDecoration: "none",
            color: theme.palette.secondary.main,
            display: "flex",
          }}
        >
          <Typography variant="body1">View All</Typography>
          <NavigateNextIcon sx={{ color: theme.palette.secondary.main }} />
        </Link>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box overflow={"visible"} position={"relative"} pr={"12.5px"}>
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
          slidesPerGroup={6}
          breakpoints={{
            0: { slidesPerView: 3, slidesPerGroup: 3 },
            640: { slidesPerView: 4, slidesPerGroup: 4 },
            1024: { slidesPerView: 6, slidesPerGroup: 6 },
          }}
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            paddingBottom: "16px",
            paddingLeft: "4px",
            paddingRight: "10px",
          }}
        >
          {listItem?.map((item, index) => (
            <SwiperSlide key={item._id || index}>
              <ProductMini item={item} />
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
            right: { xs: "-8px", sm: "-8px" },
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

FlashSale.propTypes = {
  listItem: PropTypes.array,
};

export default FlashSale;
