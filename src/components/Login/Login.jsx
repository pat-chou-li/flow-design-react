import React, { useState } from "react";
import { Button, Input, Divider, message } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import Mynav from "../Mynav/Mynav"; // Assuming MyNav is another component you have
import axios from "../../server/index";
import "./Login.scss";
import { useDispatch } from "react-redux";
import { setToken } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isReg, setIsReg] = useState(false);
  const [loginAccount, setLoginAccount] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regAccount, setRegAccount] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regNickName, setRegNickName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeReg = () => {
    setIsReg(!isReg);
  };

  const login = async () => {
    if (!loginAccount || !loginPassword) {
      message.error("请填写所有内容！");
      return;
    }
    const form = {
      adminName: loginAccount,
      adminPassword: loginPassword,
    };
    try {
      const response = await axios.post("1/admin/login", form);
      if (response.data.code === 200) {
        message.success("登录成功");
        const token = response.data.data;
        dispatch(setToken());
        localStorage.setItem("token", token);
        navigate("/commodity");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("未知错误，回调落入了catch,请联系管理员");
      console.error(error);
    }
  };

  const register = async () => {
    if (!regAccount || !regPassword || !regNickName) {
      message.error("请填写所有内容！");
      return;
    }
    const form = {
      adminName: regAccount,
      adminPassword: regPassword,
      adminNickName: regNickName,
    };
    try {
      const response = await axios.post("1/admin/register", form);
      if (response.data.code === 200) {
        message.success("注册成功");
        const token = response.data.data;
        dispatch(setToken());
        localStorage.setItem("token", token);
        navigate("/commodity");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("未知错误，回调落入了catch,请联系管理员");
      console.error(error);
    }
  };

  return (
    <div className="loginContainer">
      <Mynav
        content="点击注册/登录旁边的橙色卡片，可以切换至登录/注册"
        pageName="注册/登录"
      />
      <div className="bac"></div>
      <div
        className={`fixedCard ${isReg ? "fixedCardIsReg" : ""}`}
        onClick={changeReg}
      >
        <div className="left">
          <div className="top">
            <img className="bank" src="../../static/whiteBank.png" alt="" />
          </div>
          <img className="ch" src="../../static/loginCh.png" alt="" />
          <div className="bottom">
            <img className="textImg" src="../../static/注册.png" alt="" />
            <img className="step" src="../../static/step0.png" alt="" />
            <img className="step" src="../../static/step1.png" alt="" />
            <img className="step" src="../../static/step2.png" alt="" />
            <div className="text">REGISTERED</div>
          </div>
          <div className="final">
            <img className="monkey" src="../../static/monkey.png" alt="" />
            <div className="textContainer">
              <img
                className="text"
                src="../../static/打造百年三湘.png"
                alt=""
              />
              <img
                className="text"
                src="../../static/力创民族精品.png"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="right">
          <div className="top">
            <img className="bank" src="../../static/whiteBank.png" alt="" />
          </div>
          <img className="ch" src="../../static/loginCh.png" alt="" />
          <div className="bottom">
            <img className="textImg" src="../../static/登陆.png" alt="" />
            <img className="step" src="../../static/step0.png" alt="" />
            <img className="step" src="../../static/step1.png" alt="" />
            <img className="step" src="../../static/step2.png" alt="" />
            <div className="text">LOG IN</div>
          </div>
          <div className="final">
            <img className="monkey" src="../../static/monkey.png" alt="" />
            <div className="textContainer">
              <img
                className="text"
                src="../../static/湖南三湘银行.png"
                alt=""
              />
              <img className="text2" src="../../static/selfBank.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div className={`switchCard ${isReg ? "switchCardIsReg" : ""}`}>
        <div className={isReg ? "register" : "login"}>
          <div className="top">
            <img className="taiji" src="../../static/太极.png" alt="" />
            <div className="text">湖南三湘银行服务编排系统</div>
            <img className="saoyisao" src="../../static/扫一扫@2x.png" alt="" />
          </div>
          <div className="middle">
            <div className="bank">
              <img className="bank" src="../../static/bank.png" alt="" />
            </div>
            <div className="account">
              <Input
                prefix={<UserOutlined />}
                value={isReg ? regAccount : loginAccount}
                onChange={(e) =>
                  isReg
                    ? setRegAccount(e.target.value)
                    : setLoginAccount(e.target.value)
                }
                placeholder="请输入账户"
              />
            </div>
            <div className="password">
              <Input.Password
                prefix={<KeyOutlined />}
                value={isReg ? regPassword : loginPassword}
                size="200"
                onChange={(e) =>
                  isReg
                    ? setRegPassword(e.target.value)
                    : setLoginPassword(e.target.value)
                }
                placeholder="请输入密码"
              />
            </div>
            {isReg && (
              <div className="password">
                <Input
                  prefix={<UserOutlined />}
                  value={regNickName}
                  onChange={(e) => setRegNickName(e.target.value)}
                  placeholder="请输入昵称"
                />
              </div>
            )}
            <div className="findpw">{!isReg && "找回密码"}</div>
            <Button
              onClick={isReg ? register : login}
              id={isReg ? "regBtn" : ""}
            >
              {isReg ? "注册" : "登录"}
            </Button>
          </div>
          {!isReg && <Divider>第三方登录</Divider>}
          <div className="bottom">
            {!isReg ? (
              <div className="circleContainer">
                <div className="circle1">
                  <img className="circleImg" src="../../static/vx.png" alt="" />
                </div>
                <div className="circle2">
                  <img className="circleImg" src="../../static/qq.png" alt="" />
                </div>
              </div>
            ) : (
              <div className="text">让银行成为一种随时可得的服务</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
