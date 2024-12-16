import { Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import RequireAuth from "./pages/Auth/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Need login to access */}
        <Route element={<RequireAuth />}>
          <Route path="cart" element={<Cart />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
