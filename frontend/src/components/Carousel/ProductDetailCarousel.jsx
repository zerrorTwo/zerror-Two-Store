import { CardMedia } from "@mui/material";
import { useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./carousel.css";
import PropTypes from "prop-types";
import { PRIMITIVE_URL } from "../../redux/constants";

function ProductDetailCarousel({ listImg }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {listImg?.map((image, index) => {
          return (
            <SwiperSlide key={index}>
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt="Product image"
                image={`${PRIMITIVE_URL}${image}`}
                loading="lazy"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {listImg?.map((image, index) => {
          return (
            <SwiperSlide key={index}>
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt="Product thumbnail"
                image={`${PRIMITIVE_URL}${image}`}
                loading="lazy"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}

ProductDetailCarousel.propTypes = {
  listImg: PropTypes.array.isRequired,
};

export default ProductDetailCarousel;
