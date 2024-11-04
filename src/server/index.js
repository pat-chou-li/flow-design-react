/* eslint-disable no-unused-vars */
import axios from "axios";

axios.defaults.baseURL = "http://124.222.21.252:3900";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
  
  (config) => {
    let token = window.localStorage.getItem("token");
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
const mockResponse = {
  code: 200,
  message: "请求成功",
  data: Array.from({ length: 30 }, (v, i) => ({
    commodityId: i + 1,
    commodityName: `Mock 商品 ${i + 1}`,
    createdTime: `2023-01-${String(i + 1).padStart(2, "0")}`,
    startDay: `2023-02-${String((i % 28) + 1).padStart(2, "0")}`,
    deadline: `2024-01-${String((i % 31) + 1).padStart(2, "0")}`,
    isPublished: i % 2, // 奇数未上架，偶数上架
  })),
};

// 模拟的删除和添加
const addCommodity = (newCommodity) => {
  const newId = mockResponse.data.length + 1;
  const addedCommodity = {
    ...newCommodity,
    commodityId: newId,
  };
  mockResponse.data.push(addedCommodity);
  return {
    code: 200,
    message: "添加成功",
    data: addedCommodity,
  };
};

const deleteCommodity = (commodityId) => {
  const index = mockResponse.data.findIndex(
    (item) => item.commodityId === commodityId
  );
  if (index > -1) {
    mockResponse.data.splice(index, 1);
    return { code: 200, message: "删除成功" };
  }
  return { code: 404, message: "商品未找到" };
};

// 请求拦截器
axios.interceptors.request.use((config) => {
  if (config.method === "post" && config.url.includes("insertCommodity")) {
    // 添加商品
    const newCommodity = JSON.parse(config.data);
    const response = addCommodity(newCommodity);
    return Promise.resolve({ data: response });
  } else if (
    config.method === "get" &&
    config.url.includes("deleteCommodityById")
  ) {
    // 删除商品
    const { params } = config;
    const response = deleteCommodity(params.commodityId);
    return Promise.resolve({ data: response });
  } else if (
    config.method === "post" &&
    (config.url.includes("login") || config.url.includes("register"))
  ) {
    // 返回固定的token而不发送请求
    return Promise.resolve({
      data: {
        code: 200,
        message: config.url.includes("admin/login") ? "登录成功" : "注册成功",
        data: "fixed-token-123456", // 固定的token
      },
    });
  }
  console.log(2);
  // 默认返回所有商品
  return Promise.resolve({ data: mockResponse });
});

axios.interceptors.response.use(
  (response) => {
    // 直接返回数据，默认成功
    return Promise.resolve(response.data);
  },
  (error) => {
    // 即便出错，也返回一个默认成功的结果
    return Promise.resolve({ data: mockResponse });
  }
);

export default axios;
