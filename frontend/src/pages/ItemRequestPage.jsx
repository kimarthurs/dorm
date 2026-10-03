import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ItemRequestPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || '金将源';
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'student') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>您没有访问权限。</h2>
        <button
          className="layui-btn layui-btn-normal"
          onClick={() => navigate(-1)}
        >
          返回上一页
        </button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    itemName: '',
    type: '带入',
    expectedTime: '',
    reason: '',
  });

  const [myRequests, setMyRequests] = useState([
    {
      id: 1,
      itemName: '台式电脑',
      type: '带入',
      expectedTime: '2026-10-05 14:00',
      status: '待审核',
      reason: '因课程设计需要带入个人电脑',
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequest = {
      id: Date.now(),
      ...formData,
      status: '待审核',
    };

    setMyRequests([newRequest, ...myRequests]);
    alert('申请提交成功。');
    setFormData({
      itemName: '',
      type: '带入',
      expectedTime: '',
      reason: '',
    });
  };

  const handleCancel = (id) => {
    if (window.confirm('确定要撤销该申请吗？')) {
      apiClient.post('/api/items/request')(
        myRequests.map((req) =>
          req.id === id ? { ...req, status: '已撤销' } : req
        )
      );
    }
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
          onClick={() => navigate('/StudentDashboard')}
        >
          <i
            className="layui-icon layui-icon-left"
            style={{ marginRight: '10px' }}
          />
          大件物品出入申请
        </h2>
      </div>

      <div
        style={{
          padding: '20px',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        {/* 新建申请表单 */}
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
            新建物品出入申请
          </h3>

          <form className="layui-form" onSubmit={handleSubmit}>
            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>
                物品名称
              </label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <input
                  type="text"
                  name="itemName"
                  required
                  value={formData.itemName}
                  onChange={handleInputChange}
                  className="layui-input"
                  placeholder="例如：显示器、行李箱、自行车等"
                />
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>
                出入类型
              </label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <select
                  name="type"
                  className="layui-input"
                  value={formData.type}
                  onChange={handleInputChange}
                  style={{ display: 'block' }}
                >
                  <option value="带入">带入</option>
                  <option value="带出">带出</option>
                </select>
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>
                预计时间
              </label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <input
                  type="datetime-local"
                  name="expectedTime"
                  required
                  value={formData.expectedTime}
                  onChange={handleInputChange}
                  className="layui-input"
                />
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>
                申请原因
              </label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <textarea
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="layui-textarea"
                  placeholder="请详细说明物品出入宿舍的原因。"
                />
              </div>
            </div>

            <div
              className="layui-form-item"
              style={{ textAlign: 'center', marginTop: '20px' }}
            >
              <button
                type="submit"
                className="layui-btn layui-btn-normal"
                style={{ padding: '0 30px' }}
              >
                提交申请
              </button>
            </div>
          </form>
        </div>

        {/* 我的申请记录 */}
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
            我的申请记录
          </h3>

          <table className="layui-table">
            <thead>
              <tr>
                <th>申请编号</th>
                <th>物品名称</th>
                <th>出入类型</th>
                <th>预计时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>

            <tbody>
              {myRequests.map((req) => (
                <tr key={req.id}>
                  <td>REQ-{req.id.toString().slice(-4)}</td>
                  <td>{req.itemName}</td>
                  <td>{req.type}</td>
                  <td>{req.expectedTime}</td>

                  <td>
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        color: 'white',
                        fontSize: '12px',
                        backgroundColor:
                          req.status === '待审核'
                            ? '#FFB800'
                            : req.status === '已批准'
                              ? '#009688'
                              : req.status === '已撤销'
                                ? '#999'
                                : '#FF5722',
                      }}
                    >
                      {req.status}
                    </span>
                  </td>

                  <td>
                    {req.status === '待审核' && (
                      <button
                        className="layui-btn layui-btn-danger layui-btn-sm"
                        onClick={() => handleCancel(req.id)}
                      >
                        撤销申请
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {myRequests.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    暂无申请记录。
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