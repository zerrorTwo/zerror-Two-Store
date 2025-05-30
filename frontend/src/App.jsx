import { useDispatch } from "react-redux";
import { useEffect, lazy, Suspense } from "react";
import { setCredentials } from "./redux/features/auth/authSlice";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Common components that might be used frequently
import RequireAuth from "./pages/Auth/RequireAuth";
import AdminAuth from "./pages/Auth/AdminAuth";
import LayoutAdmin from "./pages/Admin/LayoutAdmin";
import LayoutNew from "./pages/Layout/LayoutNew";
import CreateNewCoupon from "./pages/Admin/Coupon/CreateNewCoupon";
import MyFavorite from "./pages/ProfilePage/MyFavorite";
import MyRecent from "./pages/ProfilePage/MyRecent";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import EventDasboard from "./pages/Admin/EventDashBoard";

// Lazy load all other components
const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Register = lazy(() => import("./pages/Auth/Register"));
const UserDashboard = lazy(() => import("./pages/Admin/UserDashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const CategoryDashBoard = lazy(() => import("./pages/Admin/CategoryDashBoard"));
const SearchLayout = lazy(() => import("./pages/Layout/SearchLayout"));
const ProductDetail = lazy(() =>
  import("./pages/ProductDetailPage/ProductDetail")
);
const CreateProduct = lazy(() =>
  import("./pages/Admin/CreateProduct/CreateProduct")
);
const CheckoutPage = lazy(() => import("./pages/CheckoutPage/CheckoutPage"));
const Thanks = lazy(() => import("./pages/Thanks"));
const CateDashBoard = lazy(() => import("./pages/Admin/CateDashboard"));
const ProductDashboard = lazy(() => import("./pages/Admin/ProductDashboard"));
const ProfileDashBoard = lazy(() =>
  import("./pages/ProfilePage/ProfileDasBoard")
);
const MyOrder = lazy(() => import("./pages/ProfilePage/MyOrder/MyOrder"));
const MyAccount = lazy(() => import("./pages/ProfilePage/MyAccount"));
const OrderDashBoard = lazy(() => import("./pages/Admin/OrderDashBoard"));
const OrderDetailDashBoard = lazy(() =>
  import("./pages/Admin/OrderDetailDashBoard")
);
const MainDashBoard = lazy(() => import("./pages/Admin/MainDashBoard"));
const CouponDashBoard = lazy(() =>
  import("./pages/Admin/Coupon/CouponDashBoard")
);

// Loading component
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

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
    <ThemeProvider theme={theme}>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
      />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="register" element={<Register />} />
          <Route element={<RequireAuth />}>
            <Route element={<AdminAuth />}>
              <Route path="admin" element={<LayoutAdmin />}>
                <Route
                  index
                  path="dashboard"
                  element={
                    <Suspense fallback={<Loading />}>
                      <MainDashBoard />
                    </Suspense>
                  }
                />
                <Route
                  path="cate"
                  element={
                    <Suspense fallback={<Loading />}>
                      <CateDashBoard />
                    </Suspense>
                  }
                />
                <Route
                  path="coupon"
                  element={
                    <Suspense fallback={<Loading />}>
                      <CouponDashBoard />
                    </Suspense>
                  }
                />
                <Route
                  path="create-coupon"
                  element={
                    <Suspense fallback={<Loading />}>
                      <CreateNewCoupon />
                    </Suspense>
                  }
                />
                <Route
                  path="product"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ProductDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="user"
                  element={
                    <Suspense fallback={<Loading />}>
                      <UserDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="order"
                  element={
                    <Suspense fallback={<Loading />}>
                      <OrderDashBoard />
                    </Suspense>
                  }
                />
                <Route
                  path="order/detail/:orderId"
                  element={
                    <Suspense fallback={<Loading />}>
                      <OrderDetailDashBoard />
                    </Suspense>
                  }
                />
                <Route
                  path="update-product/:id"
                  element={
                    <Suspense fallback={<Loading />}>
                      <CreateProduct />
                    </Suspense>
                  }
                />
                <Route
                  path="create-product"
                  element={
                    <Suspense fallback={<Loading />}>
                      <CreateProduct />
                    </Suspense>
                  }
                />
                <Route
                  path="user"
                  element={
                    <Suspense fallback={<Loading />}>
                      <UserDashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="event"
                  element={
                    <Suspense fallback={<Loading />}>
                      <EventDasboard />
                    </Suspense>
                  }
                />
              </Route>
            </Route>
          </Route>

          <Route path="/" element={<LayoutNew />}>
            <Route index element={<Home />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route
              path="products/category/:category"
              element={<SearchLayout />}
            />
            <Route path="search" element={<SearchLayout />} />

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
                <Route path="my-favourite" element={<MyFavorite />} />
                <Route path="my-recent" element={<MyRecent />} />
              </Route>

              <Route element={<AdminAuth />}>
                <Route path="user" element={<UserDashboard />} />
                <Route path="category" element={<CategoryDashBoard />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
