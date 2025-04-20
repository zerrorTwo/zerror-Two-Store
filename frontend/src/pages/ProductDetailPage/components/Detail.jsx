import {
  Box,
  Chip,
  Divider,
  Rating,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import QuantityGroup from "../../../components/QuantityGroup";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite"; // Icon trái tim đầy
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // Icon trái tim rỗng
import PropTypes from "prop-types";
import { useState } from "react";
import { useAddToCartMutation } from "../../../redux/api/cartSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavoriteProduct,
  removeFavoriteProduct,
  selectIsFavorite,
} from "../../../redux/features/favoriteProductSlice";

function Detail({ data, quantity, setQuantity }) {
  console.log(data);
  const [addToCart, { isLoading: isLoadingCreateNew }] = useAddToCartMutation();
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [pricing, setPricing] = useState({
    price: data?.minPrice,
    stock: data?.totalStock,
  });

  // Redux hooks cho favourite
  const dispatch = useDispatch();
  const isFavourite = useSelector((state) =>
    selectIsFavorite(state, data?._id)
  );

  // Mảng pricing từ data
  const pricingData = Array.isArray(data?.variations?.pricing)
    ? data.variations.pricing
    : Object.values(data?.variations?.pricing || {});

  // Lấy danh sách thuộc tính (trừ pricing)
  const attributes =
    data?.variations &&
    Object.keys(data.variations)
      .filter((key) => key !== "pricing")
      .map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        key,
        options: data.variations[key],
      }));

  // Cập nhật trạng thái khi người dùng chọn một thuộc tính
  const handleAttributeClick = (attributeKey, value) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attributeKey]: value,
    };
    setSelectedAttributes(newSelectedAttributes);

    const allAttributesSelected = attributes.every(
      (attr) => newSelectedAttributes[attr.key]
    );

    if (allAttributesSelected) {
      const selectedVariation = pricingData.find((pricingItem) =>
        Object.keys(newSelectedAttributes).every(
          (key) => pricingItem[key] === newSelectedAttributes[key]
        )
      );

      if (selectedVariation) {
        setPricing({
          price: selectedVariation.price,
          stock: selectedVariation.stock,
        });
      }
    }
  };

  // Kiểm tra nếu đã chọn đủ tất cả các thuộc tính
  const allAttributesSelected = attributes?.every(
    (attr) => selectedAttributes[attr.key]
  );
  const handleAddToCart = async () => {
    if (!data?._id || !allAttributesSelected || quantity <= 0) {
      toast.error(
        "Please select all required options and set a valid quantity."
      );
      return;
    }

    const addToCartData = {
      products: [
        {
          productId: data?._id,
          variations: allAttributesSelected
            ? [{ type: selectedAttributes, quantity }]
            : [],
          quantity: !allAttributesSelected ? quantity : undefined,
        },
      ],
    };

    try {
      const success = await addToCart(addToCartData).unwrap();
      if (success) {
        toast.success("Added to cart successfully!");
      } else {
        toast.error("Failed to add to cart.");
      }
    } catch (error) {
      console.error("Add to Cart Error:", error);
      toast.error(error?.data?.message || "An unexpected error occurred.");
    }
  };

  // Xử lý toggle favourite
  const handleToggleFavourite = () => {
    const product = {
      id: data._id,
      name: data.name,
      price: data.minPrice,
      slug: data.slug,
      image: data.mainImg,
    };
    if (isFavourite) {
      dispatch(removeFavoriteProduct(data._id));
      toast.info("Removed from favourites.");
    } else {
      dispatch(addFavoriteProduct(product));
      toast.success("Added to favourites!");
    }
  };

  return (
    <>
      {/* Name */}
      <Typography variant="h6" fontWeight={400}>
        {data?.name}
      </Typography>

      {/* Rating sold */}
      <Box display="flex" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1">4.8</Typography>
          <Rating name="read-only" value={4.8} readOnly size="small" />
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1">900</Typography>
          <Typography variant="body1" color="text.primary">
            Ratings
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body1">{data?.totalSold}</Typography>
          <Typography variant="body1" color="text.primary">
            Sold
          </Typography>
        </Box>
      </Box>

      {/* Price */}
      <Box display="flex" gap={2} alignItems="center" my={2}>
        <Typography variant="h4" color="primary.main">
          {new Intl.NumberFormat("en-US").format(pricing.price)}đ
        </Typography>
        <Typography
          variant="h6"
          color="text.primary"
          sx={{ textDecoration: "line-through" }}
        >
          {new Intl.NumberFormat("en-US").format(1000000)}đ
        </Typography>
      </Box>

      {/* Variations */}
      <Box display="flex" gap={2} flexDirection="column">
        {attributes?.map((item, index) => (
          <Box key={index} display="flex" gap={5}>
            <Typography variant="body1">{item.label}</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {item.options.map((option, idx) => {
                const isSelected = selectedAttributes[item.key] === option;
                return (
                  <Chip
                    key={idx}
                    sx={{
                      cursor: "pointer",
                      color: isSelected ? "white" : "text.secondary",
                      bgcolor: isSelected ? "secondary.main" : "white",
                      "&.MuiChip-clickable:hover": {
                        // Target class for clickable Chip
                        bgcolor: isSelected ? "secondary.light" : "grey.100",
                      },
                    }}
                    label={option}
                    variant="outlined"
                    onClick={() => handleAttributeClick(item.key, option)}
                  />
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Quantity */}
      <Box display="flex" gap={2} alignItems="center" mt={5}>
        <Box display="flex" gap={2} alignItems="center">
          <Typography variant="body1">Quantity:</Typography>
          <QuantityGroup quantity={quantity} setQuantity={setQuantity} />
          <Typography variant="body2" color="text.primary">
            {pricing.stock} pieces available
          </Typography>
        </Box>
      </Box>

      {/* Toggle Favourite + Add to Cart */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={2}
        gap={2}
      >
        <Button
          onClick={handleAddToCart}
          variant="contained"
          color="secondary"
          disabled={!allAttributesSelected || isLoadingCreateNew}
          startIcon={<AddShoppingCartIcon />}
          sx={{
            px: 4,
            py: 1,
            borderRadius: 1,
          }}
        >
          Add To Cart
        </Button>
        <Tooltip title="Add to Favourite">
          <IconButton
            onClick={handleToggleFavourite}
            aria-label="toggle favourite"
            color={isFavourite ? "error" : "default"}
            sx={{ p: 1 }}
          >
            {isFavourite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
}

Detail.propTypes = {
  data: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
};

export default Detail;
