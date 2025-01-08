import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCredentials } from "./redux/features/auth/authSlice";
import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import RequireAuth from "./pages/Auth/RequireAuth";
import UserDashboard from "./pages/Admin/UserDashboard";
import AdminAuth from "./pages/Auth/AdminAuth";
import Profile from "./pages/Profile";
import CategoryDashBoard from "./pages/Admin/CategoryDashBoard";
import ProductDashboard from "./pages/Admin/ProductDashboard";
import LayoutAdmin from "./pages/Admin/LayoutAdmin";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (tokenData && user) {
      const { token, expires } = tokenData;

      if (new Date().getTime() < expires) {
        dispatch(setCredentials({ user, accessToken: token }));
      } else {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
      }
    }
  });

  return (
    <Routes>
      <Route path="layout" element={<LayoutAdmin />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="product" element={<ProductDashboard />} />
        {/* <Route path="cate" element={<CateDashboard />} /> */}

        {/* Need login to access */}
        <Route element={<RequireAuth />}>
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />

          <Route element={<AdminAuth />}>
            <Route path="user" element={<UserDashboard />} />
            <Route path="category" element={<CategoryDashBoard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
