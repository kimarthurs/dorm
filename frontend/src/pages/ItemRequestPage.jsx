import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

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

  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get('/api/items/my');

      setMyRequests(response.data);
    } catch (error) {
      console.error('获取申请记录失败：', error);
      alert(
        error.response?.data?.detail ||
        '获取申请记录失败，请稍后重试。'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await apiClient.post('/api/items/request', {
        item_name: formData.itemName,
        access_type: formData.type,
        planned_time: formData.expectedTime,
        reason: formData.reason,
      });

      alert('申请提交成功。');

      setFormData({
        itemName: '',
        type: '带入',
        expectedTime: '',
        reason: '',
      });

      await fetchMyRequests();
    } catch (error) {
      console.error('提交申请失败：', error);

      alert(
        error.response?.data?.detail ||
        '提交申请失败，请稍后重试。'
      );
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('确定要撤销该申请吗？')) {
      return;
    }

    try {
      await apiClient.patch(`/api/items/${id}/cancel`);

      alert('申请已撤销。');

      await fetchMyRequests();
    } catch (error) {
      console.error('撤销申请失败：', error);

      alert(
        error.response?.data?.detail ||
        '撤销申请失败，请确认申请状态后重试。'
      );
    }
  };

  const getStatusColor = (status) => {
    if (status === '待审核') return '#FFB800';
    if (status === '已批准') return '#009688';
    if (status === '已撤销') return '#999';
    return '#FF5722';
  };

  const formatDateTime = (value) => {
    if (!value) return '-';

    return String(value).replace('T', ' ').slice(0, 16);
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

              <div
                className="layui-input-block"
                style={{ marginLeft: '130px' }}
              >
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

              <div
                className="layui-input-block"
                style={{ marginLeft: '130px' }}
              >
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

              <div
                className="layui-input-block"
                style={{ marginLeft: '130px' }}
              >
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

              <div
                className="layui-input-block"
                style={{ marginLeft: '130px' }}
              >
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

          {loading ? (
            <div
              style={{
                padding: '30px',
                textAlign: 'center',
                color: '#666',
              }}
            >
              正在加载申请记录……
            </div>
          ) : (
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
                {myRequests.map((request) => (
                  <tr key={request.id}>
                    <td>REQ-{String(request.id).padStart(4, '0')}</td>
                    <td>{request.item_name || '-'}</td>
                    <td>{request.access_type || '-'}</td>
                    <td>{formatDateTime(request.planned_time)}</td>

                    <td>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          color: 'white',
                          fontSize: '12px',
                          backgroundColor: getStatusColor(request.status),
                        }}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td>
                      {request.status === '待审核' && (
                        <button
                          className="layui-btn layui-btn-danger layui-btn-sm"
                          onClick={() => handleCancel(request.id)}
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
          )}
        </div>
      </div>
    </div>
  );
}