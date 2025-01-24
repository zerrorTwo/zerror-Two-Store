import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import PropTypes from "prop-types";
import { Box, CardMedia, IconButton } from "@mui/material";

// Tạo các nút tùy chỉnh bằng styled
import { styled } from "@mui/system";

const StyledPrevButton = styled(IconButton)({
  position: "absolute",
  top: "50%",
  left: "10px",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
  padding: "10px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  "&::after": {
    fontSize: "20px",
  },
});

const StyledNextButton = styled(IconButton)({
  position: "absolute",
  top: "50%",
  right: "10px",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
  padding: "10px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  "&::after": {
    fontSize: "20px",
  },
});

function Carousel({ data }) {
  return (
    <Box
      borderRadius={2}
      sx={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Swiper
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index}>
            <CardMedia
              component="img"
              image={item}
              alt={`Slide ${index}`}
              sx={{
                borderRadius: 2,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Các nút tùy chỉnh */}
      <StyledPrevButton className="swiper-button-prev" />
      <StyledNextButton className="swiper-button-next" />
    </Box>
  );
}

Carousel.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Carousel;
