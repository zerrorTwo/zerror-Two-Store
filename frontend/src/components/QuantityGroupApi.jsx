import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import QuantityGroup from "./QuantityGroup";
import { toast } from "react-toastify";
import { useAddToCartMutation } from "../redux/api/cartSlice";
import { useDebounce } from "../hooks/useDebounce";
import PropTypes from "prop-types";

const QuantityGroupWithAPI = forwardRef(
  ({ productId, initialQuantity, variationType }, ref) => {
    const [quantity, setQuantity] = useState(initialQuantity);
    const debouncedQuantity = useDebounce(quantity, 500); // Giảm tần suất gọi API
    const [updateQuantity, { isLoading }] = useAddToCartMutation();
    const isInitialRender = useRef(true);
    const isDeleting = useRef(false);

    // Expose the markForDeletion method to parent components
    useImperativeHandle(ref, () => ({
      markForDeletion: () => {
        isDeleting.current = true;
      },
    }));

    useEffect(() => {
      // Bỏ qua lần render đầu tiên
      if (isInitialRender.current) {
        isInitialRender.current = false;
        return;
      }

      // Bỏ qua nếu đang trong quá trình xóa
      if (isDeleting.current) {
        return;
      }

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
);

QuantityGroupWithAPI.propTypes = {
  productId: PropTypes.string.isRequired,
  initialQuantity: PropTypes.number.isRequired,
  variationType: PropTypes.object,
};

QuantityGroupWithAPI.displayName = "QuantityGroupWithAPI";

export default QuantityGroupWithAPI;
