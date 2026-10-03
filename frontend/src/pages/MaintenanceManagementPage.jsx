import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

export default function MaintenanceManagementPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'dormAdmin' && userRole !== 'admin') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>您没有访问权限。</h2>
        <button className="layui-btn layui-btn-normal" onClick={() => navigate(-1)}>
          返回上一页
        </button>
      </div>
    );
  }

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMaintenanceRecords = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/maintenance/list');
      setRecords(response.data);
    } catch (error) {
      console.error(error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await apiClient.patch(`/api/maintenance/${id}/status`, { status: newStatus });
      alert('状态更新成功');
      fetchMaintenanceRecords();
    } catch (error) {
      alert('操作失败');
    }
  };

  const getStatusColor = (status) => {
    if (status === '待处理') return '#FFB800';
    if (status === '维修中') return '#1E9FFF';
    if (status === '已完成') return '#009688';
    return '#999';
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f8' }}>
      <div className="vpn-header layui-row" style={{ backgroundImage: 'url("/header.jpg")', padding: '15px 20px', color: 'white' }}>
        <h2 style={{ fontSize: '18px', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/AdminDashboard')}>
          <i className="layui-icon layui-icon-left" style={{ marginRight: '10px' }} />
          宿舍报修与维护管理
        </h2>
      </div>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '80px auto 0' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <div style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#333' }}>
              报修工单列表
            </h3>
            <button className="layui-btn layui-btn-primary layui-btn-sm" onClick={fetchMaintenanceRecords} disabled={loading}>
              刷新列表
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              正在加载工单……
            </div>
          ) : (
            <table className="layui-table">
              <thead>
                <tr>
                  <th>工单编号</th>
                  <th>学生姓名</th>
                  <th>宿舍信息</th>
                  <th>报修内容</th>
                  <th>提交时间</th>
                  <th>当前状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item) => (
                  <tr key={item.id}>
                    <td>BX-{String(item.id).padStart(4, '0')}</td>
                    <td>{item.student_name} ({item.student_no})</td>
                    <td>{item.residence}</td>
                    <td>{item.content}</td>
                    <td>{item.create_time}</td>
                    <td>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '12px', backgroundColor: getStatusColor(item.status) }}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.status === '待处理' && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button className="layui-btn layui-btn-xs layui-btn-normal" onClick={() => handleUpdateStatus(item.id, '维修中')}>
                            开始维修
                          </button>
                        </div>
                      )}
                      {item.status === '维修中' && (
                        <button className="layui-btn layui-btn-xs" style={{ backgroundColor: '#009688', color: 'white' }} onClick={() => handleUpdateStatus(item.id, '已完成')}>
                          完成工单
                        </button>
                      )}
                      {item.status === '已完成' && (
                        <span style={{ color: '#999', fontSize: '12px' }}>已办结</span>
                      )}
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      暂无报修记录。
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