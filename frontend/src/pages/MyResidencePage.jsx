import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api'; 

export default function MyResidencePage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName') || '金将源';

  if (userRole !== 'student') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>您没有访问权限，仅限学生访问。</h2>
        <button className="layui-btn layui-btn-normal" onClick={() => navigate(-1)}>返回上一页</button>
      </div>
    );
  }

  const [residenceInfo, setResidenceInfo] = useState(null);
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadMyResidence = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const response = await apiClient.get('/api/residences/my');

        setResidenceInfo(response.data);
        setRoommates(response.data.roommates || []);
      } catch (error) {
        console.error('获取住宿信息失败：', error);
        setErrorMessage(
          error.response?.data?.detail ||
          '住宿信息加载失败，请稍后重试。'
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyResidence();
  }, []);  

  if (loading) {
    return (
      <div style={{ padding: '100px', textAlign: 'center', fontSize: '18px', color: '#666' }}>
        <i className="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop" style={{ fontSize: '24px', marginRight: '10px' }}></i>
        正在加载住宿信息...
      </div>
    );
  }

  if (errorMessage || !residenceInfo) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: '#FF5722' }}>
        <h2>{errorMessage || '暂无住宿信息'}</h2>
        <button className="layui-btn layui-btn-normal" style={{ marginTop: '20px' }} onClick={() => navigate(-1)}>返回</button>
      </div>
    );
  }

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
                <td style={{ backgroundColor: '#f8f8f8', fontWeight: 'bold' }}>入住时间</td>
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
              {roommates.length === 0 && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#999' }}>暂无室友信息</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}