import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./router/routes";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router}></RouterProvider>
  </Provider>
);
