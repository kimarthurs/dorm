import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

export default function VisitorManagementPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'dormAdmin') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>仅限管理员访问</h2>
        <button className="layui-btn layui-btn-normal" onClick={() => navigate(-1)}>
          返回
        </button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    visitorName: '',
    idNumber: '',
    phone: '',
    visitedStudent: '',
    entryTime: '',
  });

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/visitors');
      setVisitors(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/visitors/register', {
        visitor_name: formData.visitorName,
        id_number: formData.idNumber,
        phone: formData.phone,
        visit_time: formData.entryTime,
        student_no: formData.visitedStudent,
      });
      alert('登记成功');
      setFormData({
        visitorName: '',
        idNumber: '',
        phone: '',
        visitedStudent: '',
        entryTime: '',
      });
      fetchVisitors();
    } catch (error) {
      alert(error.response?.data?.detail || '登记失败');
    }
  };

  const handleLeave = async (id) => {
    try {
      await apiClient.patch(`/api/visitors/${id}/leave`);
      alert('操作成功');
      fetchVisitors();
    } catch (error) {
      alert('操作失败');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f8' }}>
      <div className="vpn-header layui-row" style={{ backgroundImage: 'url("/header.jpg")', padding: '15px 20px', color: 'white' }}>
        <h2 style={{ fontSize: '18px', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/AdminDashboard')}>
          <i className="layui-icon layui-icon-left" style={{ marginRight: '10px' }} />
          访客出入登记管理
        </h2>
      </div>

      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            新增访客登记
          </h3>

          <form className="layui-form" onSubmit={handleRegister}>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <div className="layui-form-item" style={{ flex: '1 1 45%' }}>
                <label className="layui-form-label" style={{ width: '100px' }}>访客姓名</label>
                <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                  <input type="text" name="visitorName" required value={formData.visitorName} onChange={handleInputChange} className="layui-input" />
                </div>
              </div>

              <div className="layui-form-item" style={{ flex: '1 1 45%' }}>
                <label className="layui-form-label" style={{ width: '100px' }}>证件号码</label>
                <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                  <input type="text" name="idNumber" required value={formData.idNumber} onChange={handleInputChange} className="layui-input" />
                </div>
              </div>

              <div className="layui-form-item" style={{ flex: '1 1 45%' }}>
                <label className="layui-form-label" style={{ width: '100px' }}>联系电话</label>
                <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                  <input type="text" name="phone" required value={formData.phone} onChange={handleInputChange} className="layui-input" />
                </div>
              </div>

              <div className="layui-form-item" style={{ flex: '1 1 45%' }}>
                <label className="layui-form-label" style={{ width: '100px' }}>被访学生学号</label>
                <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                  <input type="text" name="visitedStudent" required value={formData.visitedStudent} onChange={handleInputChange} className="layui-input" />
                </div>
              </div>

              <div className="layui-form-item" style={{ flex: '1 1 45%' }}>
                <label className="layui-form-label" style={{ width: '100px' }}>进入时间</label>
                <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                  <input type="datetime-local" name="entryTime" required value={formData.entryTime} onChange={handleInputChange} className="layui-input" />
                </div>
              </div>
            </div>

            <div className="layui-form-item" style={{ textAlign: 'right', marginTop: '10px' }}>
              <button type="submit" className="layui-btn layui-btn-normal">
                提交登记
              </button>
            </div>
          </form>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            访客出入记录
          </h3>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>加载中...</div>
          ) : (
            <table className="layui-table">
              <thead>
                <tr>
                  <th>访客姓名</th>
                  <th>联系电话</th>
                  <th>被访学生</th>
                  <th>进入时间</th>
                  <th>离开时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((visitor) => (
                  <tr key={visitor.id}>
                    <td>{visitor.visitor_name}</td>
                    <td>{visitor.phone}</td>
                    <td>{visitor.student_name} ({visitor.student_no})</td>
                    <td>{visitor.visit_time}</td>
                    <td style={{ color: visitor.leave_time ? '#333' : '#FF5722' }}>
                      {visitor.leave_time || '-'}
                    </td>
                    <td>
                      <span style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '12px', color: 'white', backgroundColor: visitor.status === '在访' ? '#FFB800' : '#999' }}>
                        {visitor.status}
                      </span>
                    </td>
                    <td>
                      {visitor.status === '在访' ? (
                        <button className="layui-btn layui-btn-xs layui-btn-normal" onClick={() => handleLeave(visitor.id)}>
                          登记离开
                        </button>
                      ) : (
                        <span style={{ color: '#999', fontSize: '12px' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {visitors.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>暂无数据</td>
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