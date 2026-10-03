import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

export default function CounselorStatisticsPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const [summary, setSummary] = useState({
    totalStudents: 0,
    emptyBeds: 0,
    pendingRequests: 0,
    currentVisitors: 0,
  });

  const [buildingStats, setBuildingStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchStatistics = async () => {
      if (
        userRole !== 'counselor' &&
        userRole !== 'dormAdmin' &&
        userRole !== 'admin'
      ) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErrorMessage('');

        const response = await apiClient.get('/api/statistics/summary');

        setSummary(
          response.data.summary || {
            totalStudents: 0,
            emptyBeds: 0,
            pendingRequests: 0,
            currentVisitors: 0,
          }
        );

        setBuildingStats(response.data.buildingStats || []);
      } catch (error) {
        console.error('获取宿舍统计信息失败：', error);

        setErrorMessage(
          error.response?.data?.detail ||
          '获取宿舍统计信息失败，请稍后重试。'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [userRole]);

  if (
    userRole !== 'counselor' &&
    userRole !== 'dormAdmin' &&
    userRole !== 'admin'
  ) {
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
          onClick={() => navigate(-1)}
        >
          <i
            className="layui-icon layui-icon-left"
            style={{ marginRight: '10px' }}
          />
          宿舍事务与统计信息
        </h2>
      </div>

      <div
        style={{
          padding: '20px',
          maxWidth: '1000px',
          margin: '80px auto 0',
        }}
      >
        {loading ? (
          <div
            style={{
              padding: '50px',
              textAlign: 'center',
              color: '#666',
            }}
          >
            正在加载统计信息……
          </div>
        ) : errorMessage ? (
          <div
            style={{
              padding: '30px',
              textAlign: 'center',
              color: '#FF5722',
              backgroundColor: 'white',
              borderRadius: '8px',
            }}
          >
            <p>{errorMessage}</p>
            <button
              className="layui-btn layui-btn-normal"
              onClick={() => window.location.reload()}
            >
              重新加载
            </button>
          </div>
        ) : (
          <>
            <div
              className="layui-row layui-col-space15"
              style={{
                marginBottom: '20px',
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: '1 1 22%' }}>
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#666',
                      marginBottom: '10px',
                    }}
                  >
                    在住学生
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      color: '#1E9FFF',
                      fontWeight: 'bold',
                    }}
                  >
                    {summary.totalStudents}
                  </div>
                </div>
              </div>

              <div style={{ flex: '1 1 22%' }}>
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#666',
                      marginBottom: '10px',
                    }}
                  >
                    空闲床位
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      color: '#009688',
                      fontWeight: 'bold',
                    }}
                  >
                    {summary.emptyBeds}
                  </div>
                </div>
              </div>

              <div style={{ flex: '1 1 22%' }}>
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#666',
                      marginBottom: '10px',
                    }}
                  >
                    待审核申请
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      color: '#FFB800',
                      fontWeight: 'bold',
                    }}
                  >
                    {summary.pendingRequests}
                  </div>
                </div>
              </div>

              <div style={{ flex: '1 1 22%' }}>
                <div
                  style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: '#666',
                      marginBottom: '10px',
                    }}
                  >
                    当前在访
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      color: '#FF5722',
                      fontWeight: 'bold',
                    }}
                  >
                    {summary.currentVisitors}
                  </div>
                </div>
              </div>
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
                楼栋住宿分布情况
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
                  {buildingStats.map((stat) => (
                    <tr key={stat.building}>
                      <td style={{ fontWeight: 'bold' }}>
                        {stat.building}
                      </td>
                      <td>{stat.roomCount}</td>
                      <td>{stat.occupied}</td>
                      <td
                        style={{
                          color: stat.empty > 0 ? '#009688' : '#FF5722',
                          fontWeight: 'bold',
                        }}
                      >
                        {stat.empty}
                      </td>
                    </tr>
                  ))}

                  {buildingStats.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>
                        暂无楼栋统计数据。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}