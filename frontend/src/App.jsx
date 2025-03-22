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
import ProfileDashBoard from "./pages/ProfilePage/ProfileDasBoard";
import MyOrder from "./pages/ProfilePage/MyOrder/MyOrder";
import MyAccount from "./pages/ProfilePage/MyAccount";
import OrderDashBoard from "./pages/Admin/OrderDashBoard";
import OrderDetailDashBoard from "./pages/Admin/OrderDetailDashBoard";
import MainDashBoard from "./pages/Admin/MainDashBoard";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const tokenData = localStorage.getItem("token")
          ? JSON.parse(localStorage.getItem("token"))
          : null;
        const userData = localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo"))
          : null;

        if (tokenData && userData) {
          const { token, expires: tokenExpires } = tokenData;
          const { user, expires: userExpires } = userData;

          const now = new Date().getTime();
          if (now < tokenExpires && now < userExpires) {
            // Chỉ dispatch nếu đang không có user trong state
            dispatch(setCredentials({ user, accessToken: token }));
          } else {
            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminAuth />}>
          <Route path="admin" element={<LayoutAdmin />}>
            <Route path="dashboard" element={<MainDashBoard />} />
            <Route path="cate" element={<CateDashBoard />} />
            <Route path="product" element={<ProductDashboard />} />
            <Route path="user" element={<UserDashboard />} />
            <Route path="order" element={<OrderDashBoard />} />
            <Route
              path="order/detail/:orderId"
              element={<OrderDetailDashBoard />}
            />
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
          <Route path="profile" element={<Profile />}>
            <Route index element={<ProfileDashBoard />} />
            <Route path="dashboard" element={<ProfileDashBoard />} />
            <Route path="my-order" element={<MyOrder />} />
            <Route path="my-account" element={<MyAccount />} />
          </Route>

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
