import { StrictMode } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme";
import { ToastContainer } from "react-toastify";
import "./index.css";
import AuthHandler from "./components/AuthHandler";

function App() {
  return (
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
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
            <AuthHandler />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
}

export default App;
