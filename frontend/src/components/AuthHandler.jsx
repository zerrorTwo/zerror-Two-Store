import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCredentials } from "../redux/features/auth/authSlice";
import AppRoutes from "../routes/AppRoutes";

const AuthHandler = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const userData = JSON.parse(localStorage.getItem("userInfo"));

    if (tokenData && userData) {
      const { token, expires: tokenExpires } = tokenData;
      const { user, expires: userExpires } = userData;

      if (
        new Date().getTime() < tokenExpires &&
        new Date().getTime() < userExpires
      ) {
        dispatch(setCredentials({ user, accessToken: token }));
      } else {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
      }
    }
  }, [dispatch]);

  return <AppRoutes />;
};

export default AuthHandler; 