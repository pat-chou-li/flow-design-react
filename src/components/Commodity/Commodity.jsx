/* eslint-disable no-unused-vars */
import React, { useMemo } from "react";
import Mynav from "../Mynav/Mynav";
import "./Commodity.scss";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, message, Space } from "antd";
import axios from "../../server/index";
import { useState, useEffect } from "react";
import { Popover, Progress } from "antd";
import { Popconfirm, Button, Pagination } from "antd";
import { Modal, Input } from "antd";
import { useNavigate } from "react-router-dom";
// import _ from "lodash";

const Commodity = () => {
  const timeItems = [
    {
      label: "升序",
      key: "1",
    },
    {
      label: "降序",
      key: "2",
    },
  ];

  const publicItems = [
    {
      label: "上架",
      key: "0",
    },
    {
      label: "下架",
      key: "1",
    },
    {
      label: "全部",
      key: "2",
    },
  ];

  const [allCommodity, setAllCommodity] = useState([]);
  const [groupedCommodity, setGroupedCommodity] = useState([]);
  const [currentCommodity, setCurrentCommodity] = useState([]);
  const [filterWords, setFilterWords] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteVisible, setDeleteVisible] = useState(Array(9).fill(false));
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newDialogVisible, setNewDialogVisible] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState({});

  const navigator = useNavigate();

  function go() {
    let commodityId = selectedCommodity.commodityId;
    navigator(`/flow/?id=${commodityId}`);
  }

  function getAllCommodity() {
    return allCommodity;
  }

  function dateParse(_date) {
    let date = new Date(_date);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function init() {
    axios.get("1/admin/getAllCommodity").then((res) => {
      const commodities = res.data.data;
      setAllCommodity(res.data.data);
      for (let i = 0; i < commodities.length; i++) {
        commodities[i].showDay = dateParse(commodities[i].createdTime);
        commodities[i].startDay = dateParse(commodities[i].startDay);
        commodities[i].deadline = dateParse(commodities[i].deadline);
        let _now =
          new Date(commodities[i].startDay).getTime() -
          new Date("2015/1/1").getTime();
        let _last =
          new Date(commodities[i].deadline).getTime() -
          new Date("2020/1/1").getTime();
        let per = _last / _now <= 1 ? _last / _now : _now / _last;
        commodities[i].percentage = Math.abs(per * 100).toFixed(0);
      }
      groupCommodity(commodities);
    });
  }

  function _delete(e, index) {
    e.stopPropagation();
    axios({
      method: "get",
      url: "1/admin/deleteCommodityById",
      params: { commodityId: currentCommodity[index].commodityId },
    }).then((res) => {
      if (res.data.code == 200) {
        message.success("删除成功");
        refresh();
        _cancel(e, index);
      } else {
        message.error("删除失败，请重试");
        _cancel(e, index);
      }
    });
  }
  function refresh() {
    init();
    handleCurrentChange(currentPage);
  }

  function _cancel(e, index) {
    e.stopPropagation();
    setDeleteVisible((prev) => {
      const newVisible = [...prev];
      newVisible[index] = false;
      return newVisible;
    });
  }

  function filter() {
    setCurrentCommodity([]);
    let tempAllCommodity = [];
    let value = filterWords;
    for (let i = 0; i < allCommodity.length; i++) {
      if (
        allCommodity[i].commodityName.includes(value) ||
        (allCommodity[i].commodityId + "").includes(value)
      )
        tempAllCommodity.push(allCommodity[i]);
    }
    groupCommodity(tempAllCommodity);
  }

  function debounce(fn, wait) {
    let timer = null;
    return function () {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, wait);
    };
  }

  // filter = _.debounce(filter);

  filter = debounce(filter, 500);

  function groupCommodity(allCommodity) {
    let result = [];
    for (var i = 0; i < allCommodity.length; i += 9) {
      result.push(allCommodity.slice(i, i + 9));
    }
    setGroupedCommodity(result);
    if (result.length >= currentPage) {
      setCurrentCommodity(result[currentPage - 1]);
    } else if (result.length > 0) {
      setCurrentCommodity(result[0]);
    } else {
      setCurrentCommodity([]);
    }
    return result;
  }

  function sortByCreatedTime({ key }) {
    if (key == "1") {
      allCommodity.sort((a, b) => {
        return Date.parse(a.createdTime) - Date.parse(b.createdTime);
      });
      groupCommodity(allCommodity);
    } else {
      allCommodity.sort((a, b) => {
        return Date.parse(b.createdTime) - Date.parse(a.createdTime);
      });
      groupCommodity(allCommodity);
    }
  }

  function sortByPublic({ key }) {
    //   allCommodity.sort(
    //     (a, b) => {
    //       return -(a.isPublished - b.isPublished)
    //     }
    //   )
    // 已上架
    if (key == 0) {
      setCurrentCommodity([]);
      let tempAllCommodity = [];
      for (let i = 0; i < allCommodity.length; i++) {
        if (allCommodity[i].isPublished == 1) {
          tempAllCommodity.push(allCommodity[i]);
        }
      }
      groupCommodity(tempAllCommodity);
    } else if (key == 1) {
      //未上架
      setCurrentCommodity([]);
      let tempAllCommodity = [];
      for (let i = 0; i < allCommodity.length; i++) {
        if (allCommodity[i].isPublished == 0) {
          tempAllCommodity.push(allCommodity[i]);
        }
      }
      groupCommodity(tempAllCommodity);
    } else groupCommodity(allCommodity);
  }

  function sortByUnPublic() {
    allCommodity.sort((a, b) => {
      return a.isPublished - b.isPublished;
    });
    groupCommodity(allCommodity);
  }

  function handleCurrentChange(page) {
    setCurrentPage(page);
    page--;
    setCurrentCommodity(groupedCommodity[page]);
  }

  function up(index, isPublished) {
    if (isPublished) {
      return;
    }
    axios({
      method: "get",
      url: "1/admin/publishCommodity",
      params: { commodityId: currentCommodity[index].commodityId },
    })
      .then((res) => {
        if (res.data.code == 200) {
          let newcurrentCommodity = [...currentCommodity];
          newcurrentCommodity[index].isPublished = 1;
          setCurrentCommodity(newcurrentCommodity);
          message.success("上架成功");
        } else {
          message.error(res.data.message);
        }
      })
      .catch((res) => {
        message.error(res.message);
        init();
      });
  }

  function down(index, isPublished) {
    if (!isPublished) {
      return;
    }
    let data = {
      commodityId: currentCommodity[index].commodityId,
      isPublished: 0,
    };
    data = JSON.stringify(data);
    axios
      .post("1/admin/updateCommodity", data)
      .then((res) => {
        if (res.data.code == 200) {
          let newcurrentCommodity = [...currentCommodity];
          newcurrentCommodity[index].isPublished = 0;
          setCurrentCommodity(newcurrentCommodity);
          message.success("下架成功");
        } else {
          message.error(res.message);
        }
      })
      .catch((res) => {
        message.error(res.message);
        init();
      });
  }

  function changeMain(index, item) {
    setSelectedCommodity(item);
    setDialogVisible(true);
  }

  function handleClose(index) {
    setDialogVisible(false);
    setNewDialogVisible(false);
  }

  function save() {
    selectedCommodity.startDay = dateParse(selectedCommodity.startDay);
    selectedCommodity.deadline = dateParse(selectedCommodity.deadline);
    let data = JSON.stringify(selectedCommodity);
    axios
      .post("1/admin/updateCommodity", data)
      .then((res) => {
        if (res.data.code == 200) {
          message.success("修改成功");
          setDialogVisible(false);
        } else {
          message.error(res.message);
        }
      })
      .catch((res) => {
        message.error(res.message);
        init();
      });
  }

  function addItem() {
    setSelectedCommodity({
      startDay: dateParse(new Date()),
      deadline: dateParse(new Date()),
    });
    setNewDialogVisible(true);
  }

  function addItemConfirm() {
    selectedCommodity.startDay = dateParse(selectedCommodity.startDay);
    selectedCommodity.deadline = dateParse(selectedCommodity.deadline);
    selectedCommodity.isPublished = 0;
    let data = JSON.stringify(selectedCommodity);
    axios
      .post("1/admin/insertCommodity", data)
      .then((res) => {
        if (res.data.code == 200) {
          message.success("添加成功");
          let commodityId = res.data.data.commodityId;
          init();
          setNewDialogVisible(false);
          if (currentCommodity.length < 9) {
            currentCommodity.push(selectedCommodity);
          } else {
            init();
          }
          //添加成功后询问要不要直接流程编排
          // confirm("是否直接进行流程编排?", "提示", {
          //   confirmButtonText: "确定",
          //   cancelButtonText: "稍后",
          //   type: "warning",
          // }).then(() => {
          //   navigator(`flow/?id=${commodityId}`);
          // });
        } else {
          message.error(res.message);
        }
      })
      .catch((res) => {
        message.error(res.message);
        init();
      });
  }

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    console.log(allCommodity);
    filter();
  }, [filterWords]);

  // useMemo(() => {}, [allCommodity]);

  return (
    <div className="allContainer">
      <Mynav pageName="我的产品"></Mynav>
      <div className="bankContainer">
        <img src="/static/bank.png" alt="" />
      </div>
      <div className="searchContainer">
        <div className="search">
          <SearchOutlined className="icon"></SearchOutlined>
          <input
            placeholder="输入服务名或编号"
            type="text"
            value={filterWords}
            onChange={async (e) => {
              await setFilterWords(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="searchAndSort"></div>
      <div className="sortContainer">
        <div className="sortItem">
          <Dropdown
            menu={{
              items: timeItems,
              onClick: sortByCreatedTime,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                创建时间
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
        <div className="sortItem">
          <Dropdown
            menu={{
              items: publicItems,
              onClick: sortByPublic,
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                是否上架
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </div>
      <div className="mainContainer">
        {currentCommodity.map((item, index) => (
          <div
            className="mainItem"
            key={`${item.commodityID}-${index}`}
            onClick={() => changeMain(index, item)}
          >
            <div className="top">
              <div
                className={`state ${item.isPublished ? "isPublic" : ""}`}
              ></div>
              <div className="text">{item.commodityName}</div>
              <Popconfirm
                title="确定删除吗？"
                open={deleteVisible[index]}
                onConfirm={(e) => _delete(e, index)}
                onCancel={(e) => _cancel(e, index)}
                okText="确定"
                cancelText="取消"
                placement="top"
              >
                <Button
                  className="delete"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteVisible((prev) => {
                      const newVisible = [...prev];
                      newVisible[index] = true;
                      return newVisible;
                    });
                  }}
                />
              </Popconfirm>
            </div>
            <div className="date">{item.showDay}</div>
            <div className="middle">
              <Progress
                type="circle"
                size={40}
                strokeWidth={2}
                strokeColor="rgba(255, 106, 0, 1)"
                percent={parseFloat(item.percentage)}
              />
            </div>
            <div className="bottom">
              <div className="text">{item.commodityId}</div>
              <div className="buttonContainer">
                <div
                  className={`down btn ${item.isPublished ? "" : "isPubliced"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    down(index, item.isPublished);
                  }}
                >
                  ↓
                </div>
                <div
                  className={`up btn ${item.isPublished ? "isPubliced" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    up(index, item.isPublished);
                  }}
                >
                  ↑
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="mainItem add" onClick={addItem}>
          <i className="el-icon-circle-plus-outline" />
        </div>
      </div>
      <div className="bottomContainer">
        <div className="block">
          <Pagination
            current={currentPage}
            onChange={handleCurrentChange}
            pageSize={9}
            total={allCommodity.length}
            showQuickJumper
          />
        </div>
      </div>
      <Modal
        title="编辑"
        open={dialogVisible}
        onCancel={() => setDialogVisible(false)}
        footer={[
          <Button key="back" onClick={go}>
            流程编排
          </Button>,
          <Button key="submit" type="primary" onClick={save}>
            保存
          </Button>,
        ]}
        width="24%"
      >
        <div className="dialog">
          <div className="inputItem">
            <div className="label">产品名称</div>
            <Input
              type="text"
              value={selectedCommodity.commodityName}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  commodityName: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">风险等级</div>
            <Input
              type="text"
              value={selectedCommodity.riskLevel}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  riskLevel: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">产品编号</div>
            <Input
              id="number"
              type="text"
              value={selectedCommodity.commodityId}
              disabled
            />
          </div>
          <div className="inputItem">
            <div className="label">年化利率(%)</div>
            <Input
              type="text"
              value={selectedCommodity.yearInterestRate}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  yearInterestRate: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">起存金额(元)</div>
            <Input
              type="text"
              value={selectedCommodity.startMoney}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  startMoney: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">产品期限</div>
            <Input
              type="text"
              value={selectedCommodity.commodityTimeLimit}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  commodityTimeLimit: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">单人限额(元)</div>
            <Input
              type="text"
              value={selectedCommodity.personLimit}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  personLimit: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">单日限额(元)</div>
            <Input
              type="text"
              value={selectedCommodity.dayLimit}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  dayLimit: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">起息日(精确到天)</div>
            <Input
              type="date"
              value={selectedCommodity.startDay}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  startDay: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">结息方式</div>
            <Input
              type="text"
              value={selectedCommodity.interestWay}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  interestWay: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">到期日(精确到天)</div>
            <Input
              type="date"
              value={selectedCommodity.deadline}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  deadline: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">递增金额(元)</div>
            <Input
              type="text"
              value={selectedCommodity.increaseMoney}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  increaseMoney: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="新增"
        open={newDialogVisible}
        onCancel={() => setNewDialogVisible(false)}
        footer={[
          <Button key="submit" type="primary" onClick={addItemConfirm}>
            保存
          </Button>,
        ]}
        width="24%"
      >
        <div className="dialog">
          <div className="inputItem">
            <div className="label">产品名称</div>
            <Input
              type="text"
              value={selectedCommodity.commodityName}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  commodityName: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">风险等级</div>
            <Input
              type="text"
              value={selectedCommodity.riskLevel}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  riskLevel: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">产品编号</div>
            <Input
              id="number"
              type="text"
              value={selectedCommodity.commodityId}
              disabled
            />
          </div>
          <div className="inputItem">
            <div className="label">年化利率(%)</div>
            <Input
              type="text"
              value={selectedCommodity.yearInterestRate}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  yearInterestRate: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">起存金额(元)</div>
            <Input
              type="text"
              value={selectedCommodity.startMoney}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  startMoney: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">产品期限</div>
            <Input
              type="text"
              value={selectedCommodity.commodityTimeLimit}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  commodityTimeLimit: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">单人限额(元)</div>
            <Input
              type="text"
              value={selectedCommodity.personLimit}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  personLimit: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">单日限额(元)</div>
            <Input
              type="text"
              value={selectedCommodity.dayLimit}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  dayLimit: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">起息日(精确到天)</div>
            <Input
              type="date"
              value={selectedCommodity.startDay}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  startDay: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">结息方式</div>
            <Input
              type="text"
              value={selectedCommodity.interestWay}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  interestWay: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">到期日(精确到天)</div>
            <Input
              type="date"
              value={selectedCommodity.deadline}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  deadline: e.target.value,
                }))
              }
            />
          </div>
          <div className="inputItem">
            <div className="label">递增金额(元)</div>
            <Input
              type="text"
              value={selectedCommodity.increaseMoney}
              onChange={(e) =>
                setSelectedCommodity((prev) => ({
                  ...prev,
                  increaseMoney: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Commodity;
