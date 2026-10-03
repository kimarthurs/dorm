import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VisitorManagementPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'dormAdmin') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>您没有访问权限，仅限宿舍管理员访问。</h2>
        <button
          className="layui-btn layui-btn-normal"
          onClick={() => navigate(-1)}
        >
          返回上一页
        </button>
      </div>
    );
  }

  // 访客登记表单状态
  const [formData, setFormData] = useState({
    visitorName: '',
    visitedStudent: '',
    entryTime: '',
    exitTime: '',
    remark: '',
  });

  const [visitors, setVisitors] = useState([
    {
      id: 1,
      visitorName: '李家长',
      visitedStudent: '金将源',
      entryTime: '2026-10-02 10:00',
      exitTime: '', 
      remark: '送生活用品',
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // 后续在此处调用 POST /api/visitors/register
    const newVisitor = {
      id: Date.now(),
      ...formData,
    };

    setVisitors([newVisitor, ...visitors]);
    alert('访客登记成功。');

    setFormData({
      visitorName: '',
      visitedStudent: '',
      entryTime: '',
      exitTime: '',
      remark: '',
    });
  };

  const handleLeave = (id) => {
    // 💡 나중에 PATCH /api/visitors/{id}/leave 호출로 대체
    const now = new Date();
    const formattedTime = now.getFullYear() + '-' + 
                          String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(now.getDate()).padStart(2, '0') + ' ' + 
                          String(now.getHours()).padStart(2, '0') + ':' + 
                          String(now.getMinutes()).padStart(2, '0');

    setVisitors(visitors.map(visitor => 
      visitor.id === id ? { ...visitor, exitTime: formattedTime } : visitor
    ));
    alert('访客已登记离开。');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f8' }}>
      <div
        className="vpn-header layui-row"
        style={{
          backgroundImage: 'url("/header.jpg")',
          padding: '15px 20px',
          color: 'white',
        }}
      >
        <h2
          style={{ fontSize: '18px', margin: 0, cursor: 'pointer' }}
          onClick={() => navigate('/AdminDashboard')}
        >
          <i
            className="layui-icon layui-icon-left"
            style={{ marginRight: '10px' }}
          />
          访客出入登记管理
        </h2>
      </div>

      <div
        style={{
          padding: '20px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
              marginBottom: '20px',
              color: '#333',
            }}
          >
            新增访客登记
          </h3>

          <form className="layui-form" onSubmit={handleRegister}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="layui-form-item" style={{ flex: '1 1 45%' }}>
                <label className="layui-form-label" style={{ width: '100px' }}>
                  访客姓名
                </label>
                <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                  <input
                    type="text"
                    name="visitorName"
                    required
                    value={formData.visitorName}
                    onChange={handleInputChange}
                    className="layui-input"
                    placeholder="请输入访客姓名"
                  />
                </div>
              </div>

              <div className="layui-form-item" style={{ flex: '1 1 45%' }}>
                <label className="layui-form-label" style={{ width: '100px' }}>
                  被访学生
                </label>
                <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                  <input
                    type="text"
                    name="visitedStudent"
                    required
                    value={formData.visitedStudent}
                    onChange={handleInputChange}
                    className="layui-input"
                    placeholder="请输入被访学生姓名或学号"
                  />
                </div>
              </div>

              <div className="layui-form-item" style={{ flex: '1 1 45%' }}>
                <label className="layui-form-label" style={{ width: '100px' }}>
                  进入时间
                </label>
                <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                  <input
                    type="datetime-local"
                    name="entryTime"
                    required
                    value={formData.entryTime}
                    onChange={handleInputChange}
                    className="layui-input"
                  />
                </div>
              </div>

              <div className="layui-form-item" style={{ flex: '1 1 45%' }}>
                <label className="layui-form-label" style={{ width: '100px' }}>
                  离开时间
                </label>
                <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                  <input
                    type="datetime-local"
                    name="exitTime"
                    value={formData.exitTime}
                    onChange={handleInputChange}
                    className="layui-input"
                  />
                </div>
              </div>

              <div className="layui-form-item" style={{ flex: '1 1 100%' }}>
                <label className="layui-form-label" style={{ width: '100px' }}>
                  备注
                </label>
                <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                  <input
                    type="text"
                    name="remark"
                    value={formData.remark}
                    onChange={handleInputChange}
                    className="layui-input"
                    placeholder="可填写来访原因或其他说明"
                  />
                </div>
              </div>
            </div>

            <div
              className="layui-form-item"
              style={{ textAlign: 'right', marginTop: '10px' }}
            >
              <button type="submit" className="layui-btn layui-btn-normal">
                提交登记
              </button>
            </div>
          </form>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <h3
            style={{
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
              marginBottom: '20px',
              color: '#333',
            }}
          >
            访客出入记录
          </h3>

          <table className="layui-table">
            <thead>
              <tr>
                <th>访客姓名</th>
                <th>被访学生</th>
                <th>进入时间</th>
                <th>离开时间</th>
                <th>备注</th>
                <th>操作</th> 
              </tr>
            </thead>

            <tbody>
              {visitors.map((visitor) => (
                <tr key={visitor.id}>
                  <td>{visitor.visitorName}</td>
                  <td>{visitor.visitedStudent}</td>
                  <td>{visitor.entryTime}</td>
                  <td style={{ color: visitor.exitTime ? '#333' : '#FF5722' }}>
                    {visitor.exitTime || '尚未离开'}
                  </td>
                  <td>{visitor.remark || '-'}</td>
                  <td>
                    {!visitor.exitTime ? (
                      <button
                        className="layui-btn layui-btn-xs layui-btn-normal"
                        onClick={() => handleLeave(visitor.id)}
                      >
                        登记离开
                      </button>
                    ) : (
                      <span style={{ color: '#999', fontSize: '12px' }}>已离开</span>
                    )}
                  </td>
                </tr>
              ))}

              {visitors.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    暂无访客记录。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}