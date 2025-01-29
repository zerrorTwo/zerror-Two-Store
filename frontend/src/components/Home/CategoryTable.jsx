import {
  Box,
  CardMedia,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PropTypes from "prop-types";
import { PRIMITIVE_URL } from "../../redux/constants";

export default function CategoryTable({ itemData, isLoading }) {
  const theme = useTheme();

  return (
    <>
      <Box display={"flex"} gap={1} alignItems={"center"} mb={1}>
        <MenuIcon />
        <Typography variant="h5">List category</Typography>
      </Box>

      <Box overflow={"visible"} position={"relative"}>
        <Swiper
          slidesPerView={10}
          spaceBetween={12.5}
          slidesPerGroup={10}
          grid={{
            rows: 2,
            fill: "row",
          }}
          navigation={{
            prevEl: ".swiper-button-prev-category",
            nextEl: ".swiper-button-next-category",
          }}
          modules={[Grid, Pagination, Navigation]}
          style={{
            width: "100%",
            paddingLeft: "4px",
            paddingRight: "4px",
            paddingBottom: "8px",
            overflow: "hidden",
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Empty</Typography>
            </Box>
          ) : (
            itemData.map((item, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "visible",
                    padding: "5px",
                    height: "110px",
                  }}
                >
                  <Link
                    to={item.slug}
                    style={{
                      display: "block",
                      textDecoration: "none",
                      width: "100%",
                      height: "100%",
                      color: theme.palette.text.primary,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "8px",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={`${PRIMITIVE_URL}${item.img}`}
                        sx={{
                          mt: 1,
                          borderRadius: "8px",
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          maxWidth: "50px",
                          maxHeight: "50px",
                        }}
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "0.875rem",
                          color: theme.palette.text.primary,
                          textAlign: "center",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          width: "100%",
                          wordBreak: "break-word",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                  </Link>
                </Box>
              </SwiperSlide>
            ))
          )}
        </Swiper>

        {/* Navigation Buttons */}
        <IconButton
          className="swiper-button-prev-category"
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
          className="swiper-button-next-category"
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
    </>
  );
}

CategoryTable.propTypes = {
  itemData: PropTypes.arrayOf(PropTypes.object).isRequired,
  isLoading: PropTypes.bool,
};
