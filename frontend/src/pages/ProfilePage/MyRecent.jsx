import ProductListProfile from "../../components/Layout/ProductListProfile";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
const MyRecent = () => {
  return (
    <ProductListProfile
      title="My Recent Products"
      icon={<HistoryOutlinedIcon color="info" />}
      selector={(state) => state.recentProducts.items}
    />
  );
};

export default MyRecent;
