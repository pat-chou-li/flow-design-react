import React, { useState } from 'react'
import './Home.scss'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'

const Home = () => {
  


  const atom = [{
    name: '证件审查接口',
    detail: "本接口用于校验姓名和身份证号的真实性和一致性，您可以通过输入姓名和身份证号或传入身份证人像面照片提供所需验证信息。\n默认接口请求频率限制：100次/秒\nAPI Explorer 提供了在线调用、签名验证、SDK 代码生成和快速检索接口等能力。\n您可查看每次调用的请求内容和返回结果以及自动生成 SDK 调用示例。",
  }, {
    name: '用户信息检验接口',
    detail: `传入姓名和身份证号，校验两者的真实性和一致性。
默认接口请求频率限制：100次/秒。
API Explorer 提供了在线调用、签名验证、SDK 代码生成和快速检索接口等能力。
您可查看每次调用的请求内容和返回结果以及自动生成 SDK 调用示例。`,
  }, {
    name: '白名单购买控制接口',
    detail: `黑名单启用后，被列入到黑名单的用户（或IP地址、IP包、邮件、病毒等）不能通过。
在白名单中的用户（或IP地址、IP包、邮件等）会优先通过，不会被当成垃圾邮件拒收，安全性和快捷性都大大提高
默认接口请求频率限制：100次/秒
API Explorer 提供了在线调用、签名验证、SDK 代码生成和快速检索接口等能力。
您可查看每次调用的请求内容和返回结果以及自动生成 SDK 调用示例。`,
  }, {
    name: '地域购买控制接口',
    detail: `指定一个或多个地区，设置不同程度的操作限制
默认接口请求频率限制：100次/秒
API Explorer 提供了在线调用、签名验证、SDK 代码生成和快速检索接口等能力。
您可查看每次调用的请求内容和返回结果以及自动生成 SDK 调用示例。`,
  }, {
    name: '用户标签控制接口',
    detail: `可以使用用户标签管理的相关接口，实现对公众号的标签进行创建、查询、修改、删除等操作，
也可以对用户进行打标签、取消标签等操作。
默认接口请求频率限制：100次/秒
API Explorer 提供了在线调用、签名验证、SDK 代码生成和快速检索接口等能力。
您可查看每次调用的请求内容和返回结果以及自动生成 SDK 调用示例。`,
  }, {
    name: '利息计算接口',
    detail: `依据用户所买产品及购入金额，通过大数据分析预测，计算得出用户在不同阶段获得的利息
默认接口请求频率限制：1次/秒
API Explorer 提供了在线调用、签名验证、SDK 代码生成和快速检索接口等能力。
您可查看每次调用的请求内容和返回结果以及自动生成 SDK 调用示例。`,
  }, {
    name: '库存锁定接口',
    detail: `在用户在产品订单页面确定数额后为付款成功的十分分钟内将该部分库存划为该用户所有
（注：在秒杀类产品中不适用）
默认接口请求频率限制：1次/秒
API Explorer 提供了在线调用、签名验证、SDK 代码生成和快速检索接口等能力。
您可查看每次调用的请求内容和返回结果以及自动生成 SDK 调用示例。`,
  }, {
    name: '库存释放接口',
    detail: `用户在订单页面中确定数额后十分钟内未付款成功，则该部分库存释放
默认接口请求频率限制：1次/秒
API Explorer 提供了在线调用、签名验证、SDK 代码生成和快速检索接口等能力。
您可查看每次调用的请求内容和返回结果以及自动生成 SDK 调用示例。`,
  }, {
    name: '库存更新接口',
    detail: `用户在订单页中确认数额付款成功后，即将该部分库存更新
默认接口请求频率限制：1次/秒
API Explorer 提供了在线调用、签名验证、SDK 代码生成和快速检索接口等能力。
您可查看每次调用的请求内容和返回结果以及自动生成 SDK 调用示例。`,
  }, {
    name: '日志录入接口',
    detail: `在用户操作完一个流程后，即将改过程，如时间，配置等录入至系统用户日志中记录下来
用户在订单页中确认数额付款成功后，即将该部分库存更新
默认接口请求频率限制：10次/秒
API Explorer 提供了在线调用、签名验证、SDK 代码生成和快速检索接口等能力。
您可查看每次调用的请求内容和返回结果以及自动生成 SDK 调用示例。`,
  }]

  const [activeAtom, changeActiveAtom] = useState(0)
  const navigator = useNavigate()

  function go(target){
    navigator(`./${target}`)
  }

  function anchor (id) {
    document.getElementById(id).scrollIntoView({ block: 'end', behavior: 'smooth' })
  }

  return (
    <>
      <div id="home">
        <div className="top">
          <div className="bank">
            <img src="/static/bank.png" alt=""/>
          </div>
          <div className="middle"></div>
          <div className="login">
            <div className="btn" onClick={() => go('login')}>登录/注册</div>
          </div>
        </div>
        <div className="top white"></div>
        <div className="router">
          <div className="item" onClick={() => anchor('flow')}>
            <div className="up">流程图拖动</div>
            <div className="down">Artomichi Sevice</div>
          </div>
          <div className="item" onClick={() => anchor('atom')}>
            <div className="up">原子服务简介</div>
            <div className="down">atomic services</div>
          </div>
          <div className="item" onClick={() => anchor('manage')}>
            <div className="up">后台服务管理</div>
            <div className="down">service management</div>
          </div>
          <div className="item" onClick={() => anchor('last')}>
            <div className="up">关于我们</div>
            <div className="down">about us</div>
          </div>
        </div>
        <div className="headline">
          <div className="up">湖南三湘银行</div>
          <div className="down">服务编排系统 1.0</div>
          <div className="btn" onClick={()=>go('commodity')}>立即使用</div>
        </div>
        <div className="playerContainer">
          <video src="/static/vedio.mp4" width="1100" height="520" muted autoPlay="true">
            您的浏览器不支持 video 标签。
          </video>
        </div>
        <div className="deliver">
          <div className="left">
            <div className="shadow"></div>
            <img src="/static/newEra.png" alt=""/>
          </div>
          <div className="right">
            <div className="shadow"></div>
            <img src="/static/whiteBook.png" alt=""/>
          </div>
        </div>
        <div className="flow" id="flow">
          <div className="left">
            <img src="/static/flow.png" alt=""/>
          </div>
          <div className="right">
            <div className="line1">流程图拖动</div>
            <div className="line2">无代码开发·新时代</div>
            <div className="line3">No-code development New Era</div>
            <div className="line4">拖拽添加字段、点击设置业务流、勾选分配权限，三步操作让业务数据规范严谨地流转</div>
            <div className="btn" onClick={()=>go('Commodity')}>立即使用</div>
          </div>
        </div>
        <div className="atom" id="atom">
          <div className="headline">
            <div className="up">原子服务简介</div>
            <div className="down">atomic services</div>
          </div>
          {/* <div className="atomContainer">
            <div className="item" @mouseover="activeNum = i" :className="{active: activeNum == i }" v-for="(item,i) in atoms" :key="i">
              <div className="activeContainer" v-show="activeNum == i">
                <div className="headline">
                  {{item.name}}
                </div>
                <div style="white-space: pre-wrap" className="detail">
                  {{item.detail}}
                </div>
              </div>
              <div className="Container" v-show="activeNum != i">
                {{item.name}}
              </div>
            </div>
          </div> */}
          <div className="atomContainer">
            {atom.map((item, index)=> {
              return (
              <div 
              onMouseOver={() => changeActiveAtom(index)}
              key={index}
              className={classNames("item", {'active' : activeAtom === index})}
              >
                {activeAtom === index && 
                <div className="activeContainer" >
                  <div className="headline">
                    {item.name}
                  </div>
                  <div className="detail">
                    {item.detail}
                  </div>
                </div>}
                {activeAtom !== index && 
                <div className="Container">{item.name}</div>}
              </div>)
            })}
          </div>
          <div className="shadow"></div>
        </div>
        <div className="manage">
          <div className="line1">后台可视化服务管理</div>
          <div className="line2">无代码开发·新时代</div>
          <div className="line3">
            <div className="text">No-code development New Era</div>
            <div className="btn" onClick={()=>go('Commodity')}>立即使用</div>
          </div>
          <div className="line4">清晰管理已上线与未上线服务，可增添新服务</div>
        </div>
        <div className="manageImgContainer" id="manage">
          <img src="/static/backend.png" alt=""/>
        </div>
        <div className="lastImgContainer" id="last">
          <img src="/static/last.png" alt=""/>
        </div>
      </div>
    </>
  )
}

export default Home