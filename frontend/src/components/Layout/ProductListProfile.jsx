import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { PRIMITIVE_URL } from "../../redux/constants";
import PropTypes from "prop-types";

const ProductImage = styled("img")({
  width: 80,
  height: 80,
  objectFit: "cover",
  borderRadius: "50%",
  marginRight: 12,
  padding: 5,
  border: "2px solid #ddd",
});

const ProductContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: "100%",
  background: "#ffffff",
  borderRadius: 8,
  transition: "box-shadow 0.2s",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
});

const ProductName = styled(Typography)({
  maxWidth: "300px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontWeight: 500,
  color: "#333",
});

const StyledTableCell = styled(TableCell)({
  width: "50%",
  borderBottom: "none",
});

const PriceText = styled(Typography)({
  color: "#E86A17",
  fontSize: 16,
  fontWeight: 500,
});

const StyledTable = styled(Table)({
  borderRadius: 12,
  overflow: "hidden",
});

const ProductListProfile = ({ title, selector, removeAction, icon }) => {
  const dispatch = useDispatch();
  const products = useSelector(selector);

  const handleRemove = (productId) => {
    dispatch(removeAction(productId));
  };

  const productPairs = [];
  for (let i = 0; i < products.length; i += 2) {
    productPairs.push(products.slice(i, i + 2));
  }

  return (
    <>
      <Box sx={{ my: 2, ml: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
          {icon}
        </Box>
      </Box>
      <StyledTable>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <StyledTableCell colSpan={2} align="center">
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  No products yet
                </Typography>
              </StyledTableCell>
            </TableRow>
          ) : (
            productPairs.map((pair, index) => (
              <TableRow key={index}>
                {pair.map((product) => (
                  <StyledTableCell key={product.id}>
                    <Link
                      style={{ textDecoration: "none" }}
                      to={`/products/${product.slug}`}
                    >
                      <ProductContainer>
                        {product.image && (
                          <ProductImage
                            loading="lazy"
                            src={`${PRIMITIVE_URL}${product?.image}`}
                            alt={product.name}
                          />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <ProductName variant="subtitle1">
                            {product.name}
                          </ProductName>
                          <PriceText variant="body2">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product?.price || 10000)}
                          </PriceText>
                        </Box>
                        {removeAction && (
                          <IconButton
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemove(product.id);
                            }}
                            color="error"
                            sx={{
                              "&:hover": {
                                backgroundColor: "rgba(211, 47, 47, 0.1)",
                              },
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </ProductContainer>
                    </Link>
                  </StyledTableCell>
                ))}
                {pair.length === 1 && <StyledTableCell />}
              </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
    </>
  );
};

ProductListProfile.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  selector: PropTypes.func.isRequired,
  removeAction: PropTypes.func,
  propStyle: PropTypes.shape({
    header: PropTypes.object,
    table: PropTypes.object,
    row: PropTypes.object,
    cell: PropTypes.object,
    link: PropTypes.object,
    container: PropTypes.object,
    image: PropTypes.object,
    name: PropTypes.object,
    price: PropTypes.object,
    deleteButton: PropTypes.object,
    emptyCell: PropTypes.object,
    noProductsText: PropTypes.object,
  }),
};

export default ProductListProfile;
