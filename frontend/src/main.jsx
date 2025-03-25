import { StrictMode } from "react";
import "./index.css";
import App from "./App.jsx";
import store from "../src/redux/store";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
       
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);