import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCredentials } from "./redux/features/auth/authSlice";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import RequireAuth from "./pages/Auth/RequireAuth";
import UserDashboard from "./pages/Admin/UserDashboard";
import AdminAuth from "./pages/Auth/AdminAuth";
import Profile from "./pages/Profile";
import LayoutAdmin from "./pages/Admin/LayoutAdmin";
import CategoryDashBoard from "./pages/Admin/CategoryDashBoard";
import LayoutNew from "./pages/LayoutNew";
import SearchLayout from "./pages/SearchLayout";
import ProductDetail from "./pages/ProductDetailPage/ProductDetail";
import CreateProduct from "./pages/Admin/CreateProduct/CreateProduct";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import Thanks from "./pages/Thanks";
import CateDashBoard from "./pages/Admin/CateDashboard";
import ProductDashboard from "./pages/Admin/ProductDashboard";

function App() {
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

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminAuth />}>
          <Route path="admin" element={<LayoutAdmin />}>
            <Route path="cate" element={<CateDashBoard />} />
            <Route path="product" element={<ProductDashboard />} />
            <Route path="update-product/:id" element={<CreateProduct />} />
            <Route path="create-product" element={<CreateProduct />} />

            <Route path="user" element={<UserDashboard />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<LayoutNew />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="products/:slug" element={<ProductDetail />} />
        <Route path="products/category/:category" element={<SearchLayout />} />

        {/* Need login to access */}
        <Route element={<RequireAuth />}>
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="thanks" element={<Thanks />} />
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
