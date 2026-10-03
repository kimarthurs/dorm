import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();



    const handleLogout = () => {
        localStorage.clear(); // 로그아웃 시 토큰, 권한, 이름 정보 모두 초기화
        navigate('/login');
    };

    // 로컬 스토리지에서 유저 정보 가져오기
    const userRole = localStorage.getItem('userRole') || 'student'; 
    const userName = localStorage.getItem('userName') || '金将源'; 

    // 권한별 환영 문구 설정
    let greeting = '';
    switch (userRole) {
        case 'student': 
        greeting = `欢迎您，${userName}同学。`;
        break;
        case 'counselor': 
        greeting = `欢迎您，${userName}老师。`;
        break;
        case 'dormAdmin': 
        greeting = `欢迎您，${userName}管理员。`;
        break;
        default:
        greeting = `欢迎您，${userName}。`;
    }

  return (
    <div style={{ height: 'calc(100% - 60px)' }}>
        <div className="vpn-container layui-fluid">
            <div className="vpn-header layui-row" style={{ backgroundImage: 'url("/header.jpg")' }}>
            <div className="layui-col-sm6 layui-col-xs6" style={{padding: '0 20px', fontSize: 16}}>
                <img style={{height: 20}} src="/logo.png" alt="logo" />
                <span className="layui-show-sm-inline-block layui-hide-xs">
                 资源访问控制系统
                </span>
            </div>
            <div id="header" className="layui-col-sm6 layui-col-xs6" style={{textAlign: 'right', fontSize: 14, padding: '0 20px'}}><div id="search-bar" className="layui-show-sm-inline-block layui-hide-xs">                        <input id="search-input" type="text" name="search" className="layui-input layui-anim layui-anim-scale" placeholder="站内搜索" style={{minWidth: 180, display: 'none'}} />                        <i id="search-icon" className="layui-icon layui-icon-search" style={{fontSize: 16, padding: 6, cursor: 'pointer'}} />                  </div><div className="layui-show-xs-inline-block layui-show-sm-inline-block" id="profile" style={{cursor: 'pointer'}}>                        <i className="layui-icon layui-icon-user" style={{fontSize: 16, padding: 6}} />                        <span className="layui-show-sm-inline-block layui-hide-xs">{greeting}</span>                  </div><div id="vpn-menu" className="vpn-menu layui-anim layui-anim-scale"><a className="vpn-menu-item" href="/person-manage">个人信息</a><a className="vpn-menu-item" href="/connection-manage">连接管理</a><a className="vpn-menu-item" href="/faq">使用帮助</a><a className="vpn-menu-item" href="/logout">注销</a></div></div>
            </div>
            <div id="container-body" className="layui-row" style={{width: '100%', position: 'relative'}}>
            <div id="vpn-content" className="vpn-content layui-col-xs12 layui-col-sm12 layui-col-md-offset2 layui-col-sm9 layui-col-md10"><div className="vpn-panel layui-row layui-anim layui-anim-fadein ayui-show-xs-inline-block" id="collapse-panel">                    <div className="layui-form">                        <div className="layui-form-item" style={{margin: 0}}>                            <div className="layui-inline" style={{display: 'flex', justifyContent: 'center', margin: 0}}>                                <select name="protocol" style={{width: 100, flexShrink: 0}} lay-filter="protocol">                                    <option value="http">http</option><option value="https">https</option><option value="ssh">ssh</option><option value="telnet">telnet</option><option value="rdp">RDP远程桌面</option><option value="vnc">vnc</option>                              </select>                                <input id="quick-access-input" type="text" name="goUrl" placeholder="输入域名或链接直接访问校内资源或图书馆资源" className="layui-input" />                                <button type="button" id="go" style={{maxWidth: 100}} className="layui-btn layui-hide-xs layui-btn-normal">立即跳转</button>                          </div>                            <div className="layui-row" style={{textAlign: 'center'}}>                                <button type="button" id="go" style={{width: '100%'}} className="layui-btn layui-hide-sm layui-btn-normal">立即跳转</button>                          </div>                      </div>                  </div>              </div><div id="history" />
                <div id="collect" className="layui-row vpn-content-block ui-sortable">
                <div className="layui-col-xs12 vpn-content-block__title">校园宿舍事务与出入登记管理系统</div>

                {/* 查看个人住宿信息(UC02) */}
                <div className="vpn-block-item layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3 ui-sortable-handle" style={{padding: '10px 10px 10px 0px'}}>
                    <div className="vpn-content-block-panel" onClick={() => navigate('/my-residence')} title="내 숙박 정보 조회">
                    <div className="vpn-content-block-panel__image">
                        <div><span>宿</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                        <p>查看个人住宿信息</p>
                        <p className="vpn-content-block-panel__url">My Residence (UC02)</p>
                    </div>
                    <div className="vpn-content-block-panel__collect">
                        <i className="layui-icon layui-icon-rate" />
                    </div>
                    </div>
                </div>

                {/* 提交大件物品出入申请 (UC03) */}
                <div className="vpn-block-item layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3 ui-sortable-handle" style={{padding: '10px 10px 10px 0px'}}>
                    <div className="vpn-content-block-panel" onClick={() => navigate('/item-request')} title="물품 반입/반출 신청">
                    <div className="vpn-content-block-panel__image">
                        <div><span>物</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                        <p>提交大件物品出入申请</p>
                        <p className="vpn-content-block-panel__url">Item Request (UC03)</p>
                    </div>
                    <div className="vpn-content-block-panel__collect">
                        <i className="layui-icon layui-icon-rate" />
                    </div>
                    </div>
                </div>

                {/* 提交设备报修申请 (UC05) */}
                <div className="vpn-block-item layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3 ui-sortable-handle" style={{padding: '10px 10px 10px 0px'}}>
                    <div className="vpn-content-block-panel" onClick={() => navigate('/maintenance')} title="설비 보수 신청">
                    <div className="vpn-content-block-panel__image">
                        <div><span>修</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                        <p>提交设备报修申请</p>
                        <p className="vpn-content-block-panel__url">Maintenance (UC05)</p>
                    </div>
                    <div className="vpn-content-block-panel__collect">
                        <i className="layui-icon layui-icon-rate" />
                    </div>
                    </div>
                </div>



                {/* asdasd */}
                <div
                  data-index={0}
                  className="vpn-block-item layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3 ui-sortable-handle"
                  style={{ padding: '10px 10px 10px 0px' }}
                />

              </div>

              <div className="vpn-sidebar layui-hide-xs layui-hide-sm layui-show-md-inline-block layui-col-md2 layui-col-lg2">
                <div className="sidebar-tree">
                  <div id="collectSideBar" className="sidebar-tree__item">
                    <a data-group="collect">校园宿舍事务</a>
                  </div>
                  <div className="sidebar-tree__item">
                    <a data-group="group-7">部门主页</a>
                  </div>
                </div>
              </div>

              <div id="group-7" className="layui-row vpn-content-block">
                <div className="layui-col-xs12 vpn-content-block__title">
                  部门主页
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="党政办公室-主页_党政办公室-主页"
                    data-type="vpn"
                    data-title="党政办公室-主页"
                    data-logo
                    data-url="http://dzb.bit.edu.cn"
                    title="党政办公室-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>党</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="党政办公室-主页">党政办公室-主页</p>
                      <p className="vpn-content-block-panel__url" title="dzb.bit.edu.cn">
                        dzb.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="党委组织部-主页_党委组织部-主页"
                    data-type="vpn"
                    data-title="党委组织部-主页"
                    data-logo
                    data-url="http://zzb.bit.edu.cn"
                    title="党委组织部-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>党</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="党委组织部-主页">党委组织部-主页</p>
                      <p className="vpn-content-block-panel__url" title="zzb.bit.edu.cn">
                        zzb.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="保密办公室-主页_保密办公室-主页"
                    data-type="vpn"
                    data-title="保密办公室-主页"
                    data-logo
                    data-url="http://bmc.bit.edu.cn"
                    title="保密办公室-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>保</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="保密办公室-主页">保密办公室-主页</p>
                      <p className="vpn-content-block-panel__url" title="bmc.bit.edu.cn">
                        bmc.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="人力资源部-主页_人力资源部-主页"
                    data-type="vpn"
                    data-title="人力资源部-主页"
                    data-logo
                    data-url="https://renshichu.bit.edu.cn/"
                    title="人力资源部-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>人</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="人力资源部-主页">人力资源部-主页</p>
                      <p className="vpn-content-block-panel__url" title="renshichu.bit.edu.cn">
                        renshichu.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="学生工作部-主页_学生工作部-主页"
                    data-type="vpn"
                    data-title="学生工作部-主页"
                    data-logo
                    data-url="https://xgb.bit.edu.cn"
                    title="学生工作部-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>学</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="学生工作部-主页">学生工作部-主页</p>
                      <p className="vpn-content-block-panel__url" title="xgb.bit.edu.cn">
                        xgb.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="教务部-主页_教务部-主页"
                    data-type="vpn"
                    data-title="教务部-主页"
                    data-logo
                    data-url="https://jwb.bit.edu.cn"
                    title="教务部-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>教</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="教务部-主页">教务部-主页</p>
                      <p className="vpn-content-block-panel__url" title="jwb.bit.edu.cn">
                        jwb.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="计划财务部-主页_计划财务部-主页"
                    data-type="vpn"
                    data-title="计划财务部-主页"
                    data-logo
                    data-url="https://jhcwb.bit.edu.cn/"
                    title="计划财务部-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>计</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="计划财务部-主页">计划财务部-主页</p>
                      <p className="vpn-content-block-panel__url" title="jhcwb.bit.edu.cn">
                        jhcwb.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="科学技术研究院-主页_科学技术研究院-主页"
                    data-type="vpn"
                    data-title="科学技术研究院-主页"
                    data-logo
                    data-url="http://kjc.bit.edu.cn"
                    title="科学技术研究院-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>科</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="科学技术研究院-主页">科学技术研究院-主页</p>
                      <p className="vpn-content-block-panel__url" title="kjc.bit.edu.cn">
                        kjc.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="资产与实验室管理处-主页_资产与实验室管理处-主页"
                    data-type="vpn"
                    data-title="资产与实验室管理处-主页"
                    data-logo
                    data-url="http://zsc.bit.edu.cn"
                    title="资产与实验室管理处-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>资</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="资产与实验室管理处-主页">资产与实验室管理处-主页</p>
                      <p className="vpn-content-block-panel__url" title="zsc.bit.edu.cn">
                        zsc.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="档案馆-主页_档案馆-主页"
                    data-type="vpn"
                    data-title="档案馆-主页"
                    data-logo
                    data-url="https://archives.bit.edu.cn/"
                    title="档案馆-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>档</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="档案馆-主页">档案馆-主页</p>
                      <p className="vpn-content-block-panel__url" title="archives.bit.edu.cn">
                        archives.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>

                <div
                  className="layui-col-xs12 layui-col-sm6 layui-col-md4 layui-col-lg3"
                  style={{ padding: '10px 10px 10px 0px' }}
                >
                  <div
                    className="vpn-content-block-panel"
                    data-search="技术转移中心-主页_技术转移中心-主页"
                    data-type="vpn"
                    data-title="技术转移中心-主页"
                    data-logo
                    data-url="https://ttc.bit.edu.cn"
                    title="技术转移中心-主页"
                  >
                    <div className="vpn-content-block-panel__image">
                      <div><span>技</span></div>
                    </div>
                    <div className="vpn-content-block-panel__content">
                      <p title="技术转移中心-主页">技术转移中心-主页</p>
                      <p className="vpn-content-block-panel__url" title="ttc.bit.edu.cn">
                        ttc.bit.edu.cn
                      </p>
                    </div>
                    <div className="vpn-content-block-panel__collect_ed">
                      <i className="layui-icon layui-icon-rate" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}