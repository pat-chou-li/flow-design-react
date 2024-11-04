/* eslint-disable react/prop-types */
import React from "react";
import "./Mynav.scss";
import { DownOutlined, SmileOutlined, KeyOutlined } from "@ant-design/icons";
import { Dropdown, Space, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../../store/authSlice";

export default function Mynav({ pageName }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function onClick({ key }) {
    if (key == "3") {
      localStorage.removeItem("token");
      dispatch(setToken(null));
      message.success("注销成功");
      navigate("/login");
    }
    // this.$store.commit('changeLogin', { token: '' })
    // this.$message.success('注销成功')
    // this.$router.push('/login')
  }

  const returnHome = () => {
    navigate("/");
  };

  const back = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      message.info("没有可返回的页面！");
    }
  };

  const items = [
    {
      key: "1",
      label: <Link to="/">首页</Link>,
    },
    {
      key: "2",
      label: <Link to="/commodity">我的产品</Link>,
      icon: <SmileOutlined />,
    },
    {
      key: "3",
      danger: true,
      label: <div>注销</div>,
      icon: <KeyOutlined />,
    },
  ];

  return (
    <div className="topContainer">
      <div className="left">
        <img
          className="logo"
          onClick={returnHome}
          src="/static/bank.png"
          alt=""
        />
        <img className="back" onClick={back} src="/static/back.png" alt="" />
        <div className="title">{pageName}</div>
      </div>
      <div className="mid"></div>
      <div className="right">
        <Dropdown
          menu={{
            items,
            onClick,
          }}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
}
