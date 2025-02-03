import { CardMedia } from "@mui/material";
import { useState } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./carousel.css";
function ProductDetailCarousel() {
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
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webpg" />
        </SwiperSlide>
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
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
        <SwiperSlide>
          <CardMedia
            component="img"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            alt="green iguana"
            image={
              "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1gr7lxgm3zz92.webp"
            }
            loading="lazy"
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default ProductDetailCarousel;
