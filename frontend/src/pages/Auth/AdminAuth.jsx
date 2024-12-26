import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const AdminAuth = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (user.isAdmin !== true && !hasShownToast.current) {
      toast.error("Access denied");
      hasShownToast.current = true;
      navigate("/");
    }
  }, [user.isAdmin, navigate]);

  if (user.isAdmin === true) {
    return <Outlet />;
  }

  return null;
};

export default AdminAuth;
