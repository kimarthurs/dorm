import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyResidencePage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName') || '金将源';

  // 权限校验：仅学生可以访问
  if (userRole !== 'student') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>您没有访问权限，仅限学生访问。</h2>
        <button className="layui-btn layui-btn-normal" onClick={() => navigate(-1)}>返回上一页</button>
      </div>
    );
  }

  // 演示用个人住宿数据 (나중에 GET /api/residences/my 로 교체)
  const [residenceInfo] = useState({
    campus: '良乡校区',
    building: 'A栋',
    roomNo: '305',
    bedNo: '2号床',
    status: '正常入住',
    checkInDate: '2023-09-02',
  });

  // 演示用室友数据
  const [roommates] = useState([
    { bedNo: '1号床', name: '张三', status: '已入住' },
    { bedNo: '2号床', name: userName, status: '本人' },
    { bedNo: '3号床', name: '李四', status: '已入住' },
    { bedNo: '4号床', name: '-', status: '空闲' },
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f8' }}>
      <div className="vpn-header layui-row" style={{ backgroundImage: 'url("/header.jpg")', padding: '15px 20px', color: 'white' }}>
        <h2 style={{ fontSize: '18px', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/StudentDashboard')}>
          <i className="layui-icon layui-icon-left" style={{ marginRight: '10px' }}/>
          查看个人住宿信息 (My Residence - UC02)
        </h2>
      </div>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* 个人住宿基本信息 */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            我的住宿信息
          </h3>
          <table className="layui-table">
            <colgroup>
              <col width="150" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td style={{ backgroundColor: '#f8f8f8', fontWeight: 'bold' }}>校区</td>
                <td>{residenceInfo.campus}</td>
              </tr>
              <tr>
                <td style={{ backgroundColor: '#f8f8f8', fontWeight: 'bold' }}>楼栋</td>
                <td>{residenceInfo.building}</td>
              </tr>
              <tr>
                <td style={{ backgroundColor: '#f8f8f8', fontWeight: 'bold' }}>房间号</td>
                <td>{residenceInfo.roomNo}室</td>
              </tr>
              <tr>
                <td style={{ backgroundColor: '#f8f8f8', fontWeight: 'bold' }}>床位号</td>
                <td>{residenceInfo.bedNo}</td>
              </tr>
              <tr>
                <td style={{ backgroundColor: '#f8f8f8', fontWeight: 'bold' }}>入住状态</td>
                <td style={{ color: '#009688', fontWeight: 'bold' }}>{residenceInfo.status}</td>
              </tr>
              <tr>
                <td style={{ backgroundColor: '#f8f8f8', fontWeight: 'bold' }}>入住时间 </td>
                <td>{residenceInfo.checkInDate}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 室友信息 */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            同寝室友
          </h3>
          <table className="layui-table">
            <thead>
              <tr>
                <th>床位号</th>
                <th>学生姓名</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {roommates.map((roommate, index) => (
                <tr key={index} style={{ backgroundColor: roommate.status === '本人' ? '#e6f7ff' : 'transparent' }}>
                  <td>{roommate.bedNo}</td>
                  <td>{roommate.name}</td>
                  <td>
                    <span style={{ 
                      color: roommate.status === '空闲' ? '#FF5722' : 
                             roommate.status === '本人' ? '#1E9FFF' : '#009688',
                      fontWeight: roommate.status === '本人' ? 'bold' : 'normal'
                    }}>
                      {roommate.status}
                    </span>
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