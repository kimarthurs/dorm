import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CounselorStatisticsPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'counselor' && userRole !== 'dormAdmin') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>您没有访问权限，仅限辅导员或管理员访问。</h2>
        <button className="layui-btn layui-btn-normal" onClick={() => navigate(-1)}>返回上一页</button>
      </div>
    );
  }

  const [summary] = useState({
    totalStudents: 128,
    emptyBeds: 24,
    pendingRequests: 3,
    currentVisitors: 2
  });

  const [buildingStats] = useState([
    { building: 'A栋', roomCount: 50, occupied: 180, empty: 20 },
    { building: 'B栋', roomCount: 40, occupied: 150, empty: 10 },
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f8' }}>
      <div className="vpn-header layui-row" style={{ backgroundImage: 'url("/header.jpg")', padding: '15px 20px', color: 'white' }}>
        <h2 style={{ fontSize: '18px', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/CounselorDashboard')}>
          <i className="layui-icon layui-icon-left" style={{ marginRight: '10px' }}/>
          宿舍事务与统计信息 (Dormitory Statistics - UC12)
        </h2>
      </div>

      <div style={{ padding: '20px', maxWidth: '1000px', margin: '120px auto 0' }}>
        
        <div className="layui-row layui-col-space15" style={{ marginBottom: '20px' }}>
          <div className="layui-col-xs6 layui-col-md3">
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>在住学生</div>
              <div style={{ fontSize: '28px', color: '#1E9FFF', fontWeight: 'bold' }}>{summary.totalStudents}</div>
            </div>
          </div>
          <div className="layui-col-xs6 layui-col-md3">
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>空闲床位</div>
              <div style={{ fontSize: '28px', color: '#009688', fontWeight: 'bold' }}>{summary.emptyBeds}</div>
            </div>
          </div>
          <div className="layui-col-xs6 layui-col-md3">
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>待审核申请</div>
              <div style={{ fontSize: '28px', color: '#FFB800', fontWeight: 'bold' }}>{summary.pendingRequests}</div>
            </div>
          </div>
          <div className="layui-col-xs6 layui-col-md3">
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>当前在访</div>
              <div style={{ fontSize: '28px', color: '#FF5722', fontWeight: 'bold' }}>{summary.currentVisitors}</div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            楼栋分布情况 
          </h3>
          <table className="layui-table">
            <thead>
              <tr>
                <th>楼栋</th>
                <th>房间数</th>
                <th>在住人数</th>
                <th>空闲床位</th>
              </tr>
            </thead>
            <tbody>
              {buildingStats.map((stat, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 'bold' }}>{stat.building}</td>
                  <td>{stat.roomCount}</td>
                  <td>{stat.occupied}</td>
                  <td style={{ color: stat.empty > 0 ? '#009688' : '#FF5722', fontWeight: 'bold' }}>
                    {stat.empty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}