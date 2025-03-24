import { useState, useEffect } from "react";
import QuantityGroup from "./QuantityGroup";
import { toast } from "react-toastify";
import { useAddToCartMutation } from "../redux/api/cartSlice";
import { useDebounce } from "../hooks/useDebounce";
import PropTypes from "prop-types";

function QuantityGroupWithAPI({ productId, initialQuantity, variationType }) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const debouncedQuantity = useDebounce(quantity, 500); // Giảm tần suất gọi API
  const [updateQuantity, { isLoading }] = useAddToCartMutation();

  useEffect(() => {
    const updateCart = async () => {
      try {
        const payload = {
          state: "ACTIVE",
          products: [
            {
              productId,
              variations: [
                {
                  type: variationType,
                  isUpdate: true,
                  quantity: debouncedQuantity,
                },
              ],
            },
          ],
        };

        const response = await updateQuantity(payload).unwrap();
        if (response) {
          toast.success("Quantity updated successfully");
        }
      } catch (error) {
        console.error("Update Error:", error);
        if (error?.data?.message) {
          toast.error(error.data.message);
        } else {
          toast.error("Failed to update quantity");
        }
      }
    };

    // Chỉ gọi API nếu số lượng thay đổi và lớn hơn 0
    if (debouncedQuantity > 0 && debouncedQuantity !== initialQuantity) {
      updateCart();
    }
  }, [
    debouncedQuantity,
    productId,
    variationType,
    updateQuantity,
    initialQuantity,
  ]);

  return (
    <QuantityGroup
      quantity={quantity}
      setQuantity={setQuantity}
      isLoading={isLoading} // Truyền trạng thái loading để disable khi đang gọi API
    />
  );
}

QuantityGroupWithAPI.propTypes = {
  productId: PropTypes.string.isRequired,
  initialQuantity: PropTypes.number.isRequired,
  variationType: PropTypes.object,
};

export default QuantityGroupWithAPI;
