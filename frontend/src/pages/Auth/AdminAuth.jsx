import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

const AdminAuth = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const hasShownToast = useRef(false);
  const isUserAdmin = user?.user?.isAdmin || user?.isAdmin;

  useEffect(() => {
    if (isUserAdmin !== true && !hasShownToast.current) {
      toast.error("Access denied");
      hasShownToast.current = true;
      navigate("/");
    }
  }, [isUserAdmin, navigate]);

  if (isUserAdmin === true) {
    return <Outlet />;
  }

  return null;
};

export default AdminAuth;
