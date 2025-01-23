import HeaderLayout from "../components/HeaderLayout.jsx";
import Footer from "../components/Footer.jsx";
import { Outlet } from "react-router";
function LayoutNew() {
  return (
    <>
      <HeaderLayout />
      <Outlet />
      <Footer />
    </>
  );
}

export default LayoutNew;
