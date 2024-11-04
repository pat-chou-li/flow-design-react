/* eslint-disable no-unused-vars */
import React from "react";
import "./Flow.scss";
import { useLocation } from "react-router-dom";
import Mynav from "../Mynav/Mynav";
import { useState } from "react";
import { useEffect } from "react";
import { Graph, Shape } from "@antv/x6";
import { Keyboard } from "@antv/x6-plugin-keyboard";
import { Stencil } from "@antv/x6-plugin-stencil";
import { Input } from "antd";

import qs from "qs";
const X6 = { Graph };

export default function Flow() {
  const [currentNode, setCurrentNode] = useState(null);
  const [currentNodeVm, setCurrentNodeVm] = useState(null);
  const [flowTemplateName, setFlowTemplateName] = useState("");
  const [switchFlag, setSwitchFlag] = useState(1);
  const [testRes, setTestRes] = useState("尚未测试");
  const [testFlag, setTestFlag] = useState(false);
  const [modelSearchInput, setModelSearchInput] = useState("");
  const [modelData, setModelData] = useState([]);
  const [currentModelData, setCurrentModelData] = useState([]);
  const [commodityId, setCommodityId] = useState("");
  const [serviceFlowId, setServiceFlowId] = useState("");
  const [firstFlag, setFirstFlag] = useState(false);
  const graphRef = React.useRef(null);
  const [graph, setGraph] = useState(null);

  const saveTemplate = () => {
    // Implement save template logic
  };

  const switchPanel = (flag) => {
    setSwitchFlag(flag);
  };

  const filterModels = () => {
    // Implement filtering logic based on modelSearchInput
  };

  const chooseModel = (index) => {
    // Implement choose model logic
  };

  const deleteTemplate = (item) => {
    // Implement delete template logic
  };

  const createFinishData = () => {
    let nodes = graph.getNodes();
    let edges = graph.getEdges();
    let map = new Map();
    //将不存在的失败节点推入map
    map.set("fail", {
      next: null,
      failNext: null,
      data: { type: "失败" },
      isEnd: true,
    });
    let startNode = [];
    // 初始化所有节点，将id和type加入map，next和failnext都设置为空
    // 实际上是一棵二叉树
    for (let i = 0; i < nodes.length; i++) {
      let id = nodes[i].id;
      let type = nodes[i].data.type;
      if (type == "开始") {
        startNode.push(id);
      }
      map.set(id, {
        next: null,
        failNext: null,
        data: nodes[i].data,
        isEnd: false,
      });
    }
    // 遍历所有edge，补全node的next和failnext属性
    for (let i = 0; i < edges.length; i++) {
      let source = edges[i].store.data.source.cell;
      let target = edges[i].store.data.target.cell;
      // 没有点击过，data是空的，默认是黑线所以是true
      if (edges[i].data == undefined) edges[i].data = { type: true };
      let type = edges[i].data.type;
      if (type == undefined) type = true;
      //获取节点的data，加入next属性和failNext属性
      let sourceData = map.get(source);
      if (type) {
        if (sourceData.next != null) return false;
        sourceData.next = target;
      } else {
        if (sourceData.failNext != null) return false;
        sourceData.failNext = target;
      }
    }
    //将map转为object
    var obj = Object.create(null);

    var iterator = map.keys();
    for (var i = 0; i < map.size; i++) {
      console.log(key);
      var key = iterator.next().value;
      obj[key] = map.get(key);
    }
    // let flowContent = JSON.stringify({ startNode, states: obj });
    // let graph2 = graph.toJSON();
    // graph2 = JSON.stringify(graph2);
    // return {
    //   flowContent,
    //   graph2,
    // };
    return { startNode, states: obj };
  };

  const test = () => {
    //提取节点数组
    let flowContent = createFinishData();
    if (flowContent === false) {
      setTestRes("节点的流向不确定，可能存在多分支！");
      setTestFlag(false);
      return;
    }
    console.log(flowContent);
    const startNodes = flowContent.startNode;
    if (startNodes.length > 1) {
      setTestRes("多个起始节点！");
      setTestFlag(false);
      return;
    }
    if (startNodes.length == 0) {
      setTestRes("缺少起始节点！");
      setTestFlag(false);
      return;
    }
    let startNode = startNodes[0];
    let nodesArr = flowContent.states;
    let queue = [];
    queue.unshift(nodesArr[startNode]);
    while (queue.length) {
      //下一个节点，包括next和failnext数据
      let node = queue.pop();
      let nextNode = node.next;
      let failNextNode = node.failNext;
      if (
        nextNode === null &&
        failNextNode === null &&
        node.data.type != "成功"
      ) {
        // 遇到中断的节点
        setTestRes("节点没有到达终点！");
        setTestFlag(false);
        return;
      }
      if (node.data.type == "成功") {
        continue;
      }
      if (nextNode != null) {
        queue.unshift(nodesArr[nextNode]);
      }
      if (failNextNode != null) {
        queue.unshift(nodesArr[failNextNode]);
      }
    }
    setTestRes("测试通过！");
    setTestFlag(true);
  };

  const finish = () => {
    // Implement finish logic
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    setCommodityId(id);

    const setting = {
      container: document.getElementById("container"),
      height: 730,
      width: 1100,
      background: {
        color: "rgb(242,242,242)",
      },
      grid: {
        size: 10,
        visible: true,
      },
      snapline: true, //对齐线
      //剪切板
      clipboard: {
        enabled: true,
      },
      //启用键盘快捷键
      keyboard: {
        enabled: true,
        global: true,
      },
      resizing: {
        enabled: true, //启用大小编辑
      },
      selecting: {
        enabled: true,
        //rubberband: true, // 启用框选
        showNodeSelectionBox: true,
      },
      //滚轮缩放
      mousewheel: {
        enabled: true,
        modifiers: ["ctrl", "meta"],
      },
      scroller: {
        enabled: true,
        pannable: true,
      },
      connecting: {
        //吸附半径
        snap: {
          radius: 20,
        },
        //不允许链接空白处
        allowBlank: false,
        //不允许重复链接
        allowMulti: false,
        //不允许循环链接
        allowLoop: false,
        //不允许链接到点上(只能链接到port上)
        allowNode: false,
        //不允许链接到线上
        allowEdge: false,
        connector: {
          name: "rounded",
          args: {
            radius: 20,
          },
        },
      },
    };
    let graph = new X6.Graph(setting);
    setGraph(graph);
    graphRef.current = graph;

    //启用复制黏贴
    graph.use(
      new Keyboard({
        enabled: true,
      })
    );
    graph.bindKey("ctrl+c", () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.copy(cells);
      }
      return false;
    });

    graph.bindKey("ctrl+v", () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 });
        graph.cleanSelection();
        graph.select(cells);
      }
      return false;
    });

    //左侧菜单
    const stencil = new Stencil({
      title: "搜索",
      target: graph,
      search: (cell, keyword, groupName, stencil) => {
        if (keyword) {
          return cell.attr("text/text").includes(keyword);
        }
        return true;
      },
      collapsable: true, //分组是否可折叠
      stencilGraphWidth: 200,
      stencilGraphHeight: 500,
      stencilGraphPadding: 10,
      groups: [
        {
          name: "group1",
          title: "起始点",
          graphHeight: 100,
        },
        {
          name: "group2",
          title: "原子服务",
          graphHeight: 218,
        },
      ],
      layoutOptions: {
        columns: 2,
        rowHeight: "compact",
      },
    });
    let left = document.getElementsByClassName("menuContainer")[0];
    left.appendChild(stencil.container);
    //此处自定义原子服务节点
    const start = new Shape.Circle({
      width: 60,
      height: 60,
      tools: [
        {
          name: "button-remove", // 工具名称
          args: { x: 50, y: 5 }, // 工具对应的参数
        },
      ],
      attrs: {
        circle: {
          fill: "white",
          strokeWidth: 1,
          stroke: "rgba(201, 201, 4, 1)",
        },
        text: { text: "开始", fill: "rgba(201, 201, 4, 1)" },
      },
      ports: {
        groups: {
          out: {
            position: "bottom",
            attrs: {
              circle: {
                r: 3,
                magnet: true,
                stroke: "orange",
                strokeWidth: 1,
                fill: "#fff",
              },
            },
          },
        },
        items: [
          {
            id: "port1",
            group: "out",
          },
        ],
      },
      data: {
        type: "开始",
      },
    });
    const fail = new Shape.Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: { fill: "#FE854F", strokeWidth: 6, stroke: "#4B4A67" },
        text: { text: "失败", fill: "red" },
      },
      ports: {
        groups: {
          in: {
            position: "top",
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff",
              },
            },
          },
        },
        items: [
          {
            id: "port1",
            group: "in",
          },
        ],
      },
    });
    const success = new Shape.Circle({
      width: 60,
      height: 60,
      attrs: {
        circle: {
          fill: "white",
          strokeWidth: 1,
          stroke: "rgba(5, 171, 66, 1)",
        },
        text: { text: "成功", fill: "rgba(5, 171, 66, 1)" },
      },
      tools: [
        {
          name: "button-remove", // 工具名称
          args: { x: 50, y: 5 }, // 工具对应的参数
        },
      ],
      ports: {
        groups: {
          in: {
            position: "top",
            attrs: {
              circle: {
                r: 3,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 1,
                fill: "#fff",
              },
            },
          },
        },
        items: [
          {
            id: "port1",
            group: "in",
          },
        ],
      },
      data: {
        type: "成功",
      },
    });
    const serverStyle = {
      width: 85,
      height: 30,
      tools: [
        {
          name: "button-remove", // 工具名称
          args: { x: 5, y: 5 }, // 工具对应的参数
        },
      ],
      ports: {
        groups: {
          in: {
            position: "top",
            attrs: {
              circle: {
                r: 2,
                magnet: true,
                stroke: "orange",
                strokeWidth: 1,
                fill: "#fff",
              },
            },
          },
          out: {
            position: "bottom",
            attrs: {
              circle: {
                r: 2,
                magnet: true,
                stroke: "orange",
                strokeWidth: 1,
                fill: "#fff",
              },
            },
          },
          failOut: {
            position: "left",
            attrs: {
              circle: {
                r: 2,
                magnet: true,
                stroke: "orange",
                strokeWidth: 1,
                fill: "#fff",
              },
            },
          },
        },
        items: [
          {
            id: "port1",
            group: "in",
          },
          {
            id: "port2",
            group: "out",
          },
          {
            id: "port3",
            group: "failOut",
          },
        ],
      },
    };
    const server1 = new Shape.Rect({
      ...serverStyle,
      data: {
        type: "地域审查",
        places: [],
      },
      attrs: {
        rect: { fill: "white", stroke: "#c0c0c0", strokeWidth: 1 },
        text: { text: "地域审查", fill: "black", fontSize: 12 },
      },
    });
    const server2 = new Shape.Rect({
      ...serverStyle,
      data: {
        type: "证件审查",
      },
      attrs: {
        rect: { fill: "white", stroke: "#c0c0c0", strokeWidth: 1 },
        text: { text: "证件审查", fill: "black", fontSize: 12 },
      },
    });
    const server3 = new Shape.Rect({
      ...serverStyle,
      data: {
        type: "用户信息检验",
      },
      attrs: {
        rect: { fill: "white", stroke: "#c0c0c0", strokeWidth: 1 },
        text: { text: "用户信息检验", fill: "black", fontSize: 12 },
      },
    });
    const server4 = new Shape.Rect({
      ...serverStyle,
      data: {
        type: "白名单购买控制",
      },
      attrs: {
        rect: { fill: "white", stroke: "#c0c0c0", strokeWidth: 1 },
        text: { text: "白名单购买控制", fill: "black", fontSize: 12 },
      },
    });
    const server5 = new Shape.Rect({
      ...serverStyle,
      data: {
        type: "用户标签控制",
      },
      attrs: {
        rect: { fill: "white", stroke: "#c0c0c0", strokeWidth: 1 },
        text: { text: "用户标签控制", fill: "black", fontSize: 12 },
      },
    });
    const server6 = new Shape.Rect({
      ...serverStyle,
      data: {
        type: "利息计算",
      },
      attrs: {
        rect: { fill: "white", stroke: "#c0c0c0", strokeWidth: 1 },
        text: { text: "利息计算", fill: "black", fontSize: 12 },
      },
    });
    const server7 = new Shape.Rect({
      ...serverStyle,
      data: {
        type: "库存锁定",
      },
      attrs: {
        rect: { fill: "white", stroke: "#c0c0c0", strokeWidth: 1 },
        text: { text: "库存锁定", fill: "black", fontSize: 12 },
      },
    });
    const server8 = new Shape.Rect({
      ...serverStyle,
      data: {
        type: "库存释放",
      },
      attrs: {
        rect: { fill: "white", stroke: "#c0c0c0", strokeWidth: 1 },
        text: { text: "库存释放", fill: "black", fontSize: 12 },
      },
    });
    const server9 = new Shape.Rect({
      ...serverStyle,
      data: {
        type: "库存更新",
      },
      attrs: {
        rect: { fill: "white", stroke: "#c0c0c0", strokeWidth: 1 },
        text: { text: "库存更新", fill: "black", fontSize: 12 },
      },
    });
    const server10 = new Shape.Rect({
      ...serverStyle,
      data: {
        type: "日志录入",
      },
      attrs: {
        rect: { fill: "white", stroke: "#c0c0c0", strokeWidth: 1 },
        text: { text: "日志录入", fill: "black", fontSize: 12 },
      },
    });
    //此处将原子服务加入左侧列表
    stencil.load([start, success], "group1");
    stencil.load(
      [
        server1,
        server2,
        server3,
        server4,
        server5,
        server6,
        server7,
        server8,
        server9,
        server10,
      ],
      "group2"
    );
    // 为edge添加点击事件，改变edge的type
    graph.on("edge:click", ({ e, x, y, edge, view }) => {
      if (edge.data == undefined) edge.data = { type: true };
      if (edge.data.type == false) {
        edge.attr("line/stroke", "black");
        edge.data.type = true;
      } else {
        edge.attr("line/stroke", "red");
        edge.data.type = false;
      }
    });
    //更改选定节点
    graph.on("node:click", ({ e, x, y, node, view }) => {
      setCurrentNode(node);
    });
  }, []);
  return (
    <div className="flow">
      <Mynav
        content="在这里可以对产品进行服务流程编排，默认连线表示成功后的流向，点击连线可以使连线变红，表示失败后的流向"
        pageName="服务编排页面" // Assuming you have this value somewhere
      />
      <div className="bottomContainer">
        <div className="left">
          <div className="menuContainer"></div>
        </div>
        <div className="middle">
          <div id="container" ref={graphRef}></div>
        </div>
        <div className="right">
          <div className="attr">
            <div className="title">
              <div className="titleText">详细属性</div>
            </div>
            <div className="cptContainer">
              <div className="attrName">id:</div>
              <Input
                className="idAtt"
                value={currentNode ? currentNode.id : "未选中节点"}
                disabled
              ></Input>
            </div>
          </div>
          <div className="testRes">
            <div className="resTop">
              <div className="el-icon-picture-outline-round"></div>
              <div className="resText">测试结果</div>
            </div>
            <div className="resDeliver"></div>
            <div className="resBottom">{testRes}</div>
          </div>
          <div className="lastButton">
            <div className="button test" onClick={test}>
              测试
            </div>
            <div className="button next" onClick={finish}>
              下一步
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
