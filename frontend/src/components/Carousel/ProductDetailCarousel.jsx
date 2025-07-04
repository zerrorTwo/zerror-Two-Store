import CardMedia from "@mui/material/CardMedia";
import { useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./carousel.css";
import PropTypes from "prop-types";

function ProductDetailCarousel({ listImg }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#000",
          "--swiper-pagination-color": "#000",
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
                image={`${image}`}
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
                image={`${image}`}
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
