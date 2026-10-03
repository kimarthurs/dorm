import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

export default function MaintenancePage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'student') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>仅限学生访问</h2>
        <button className="layui-btn layui-btn-normal" onClick={() => navigate(-1)}>返回</button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    deviceType: '空调',
    description: '',
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/maintenance');
      setRequests(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/maintenance/request', {
        device_type: formData.deviceType,
        description: formData.description,
      });
      alert('报修提交成功');
      setFormData({ deviceType: '空调', description: '' });
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.detail || '提交失败');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f8' }}>
      <div className="vpn-header layui-row" style={{ backgroundImage: 'url("/header.jpg")', padding: '15px 20px', color: 'white' }}>
        <h2 style={{ fontSize: '18px', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/StudentDashboard')}>
          <i className="layui-icon layui-icon-left" style={{ marginRight: '10px' }} />
          设施报修申请
        </h2>
      </div>

      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            提交新报修
          </h3>
          <form className="layui-form" onSubmit={handleSubmit}>
            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>设备类型</label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <select name="deviceType" className="layui-input" value={formData.deviceType} onChange={handleInputChange} style={{ display: 'block' }}>
                  <option value="空调">空调</option>
                  <option value="照明">照明</option>
                  <option value="卫浴">卫浴</option>
                  <option value="门窗">门窗</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>故障描述</label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <textarea name="description" required value={formData.description} onChange={handleInputChange} className="layui-textarea" placeholder="请详细描述故障情况..." />
              </div>
            </div>

            <div className="layui-form-item" style={{ textAlign: 'center', marginTop: '20px' }}>
              <button type="submit" className="layui-btn layui-btn-normal">提交报修</button>
            </div>
          </form>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            我的报修记录
          </h3>
          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>加载中...</div>
          ) : (
            <table className="layui-table">
              <thead>
                <tr>
                  <th>设备类型</th>
                  <th>故障描述</th>
                  <th>状态</th>
                  <th>提交时间</th>
                  <th>完成时间</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.device_type}</td>
                    <td>{req.description}</td>
                    <td>
                      <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '12px', color: 'white', backgroundColor: req.status === '待处理' ? '#FFB800' : '#009688' }}>
                        {req.status}
                      </span>
                    </td>
                    <td>{req.created_at}</td>
                    <td>{req.completed_at || '-'}</td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan="5" style={{ textAlign: 'center' }}>暂无报修记录</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}