import { ToastContainer } from "react-toastify";
import theme from "./theme";
import { ThemeProvider } from "@mui/material";
import Layout from "./pages/Auth/Layout";
import { Route, RouterProvider, createRoutesFromElements } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index path="/" element={<Home />} />
      <Route index path="/menu" element={<Menu />} />
      <Route index path="/cart" element={<Cart />} />
      <Route index path="/login" element={<Login />} />
      <Route index path="/register" element={<Register />} />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router}>
        <ToastContainer />
        <ThemeProvider theme={theme}>
          <Layout />
        </ThemeProvider>
      </RouterProvider>
    </>
  );
}

export default App;
