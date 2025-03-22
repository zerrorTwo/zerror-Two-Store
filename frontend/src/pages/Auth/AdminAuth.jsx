import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";

const AdminAuth = () => {
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const isUserAdmin = user?.isAdmin;

  useEffect(() => {
    if (!isUserAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    }
  }, [isUserAdmin, navigate]);

  return isUserAdmin ? <Outlet /> : null;
};

export default AdminAuth;
