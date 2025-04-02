import { removeFavoriteProduct } from "../../redux/features/favoriteProductSlice";
import ProductListProfile from "../../components/Layout/ProductListProfile";
import FavoriteIcon from "@mui/icons-material/Favorite";
const MyFavorite = () => {
  return (
    <ProductListProfile
      title="My Favourite Products"
      icon={<FavoriteIcon color="error" />}
      selector={(state) => state.favoriteProducts.items}
      removeAction={removeFavoriteProduct}
    />
  );
};

export default MyFavorite;
