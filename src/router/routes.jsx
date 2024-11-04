import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import Home from "../components/Home/Home.jsx";
import Commodity from "../components/Commodity/Commodity.jsx";
import Flow from "../components/flow/flow.jsx";
import Login from "../components/Login/Login.jsx";
import { useSelector } from "react-redux";
import { message } from "antd";
import Test from "../test/test.jsx";

const AuthHOC = ({ children }) => {
  const token =
    useSelector((state) => state.user.token) || localStorage.getItem("token");

  const { pathname } = useLocation();
  if (pathname == "/login") {
    if (token) {
      message.info("已登录");
      return <Navigate to="/commodity"></Navigate>;
    }
    return children;
  }
  if (token) return children;
  message.error("未登录");
  return <Navigate to="/login"></Navigate>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home></Home>,
  },
  {
    path: "commodity",
    element: (
      <AuthHOC>
        <Commodity></Commodity>
      </AuthHOC>
    ),
  },
  {
    path: "flow",
    element: (
      <AuthHOC>
        <Flow></Flow>
      </AuthHOC>
    ),
  },
  {
    path: "login",
    element: (
      <AuthHOC>
        <Login></Login>
      </AuthHOC>
    ),
  },
  {
    path: "test",
    element: <Test></Test>,
  },
]);

export default router;
