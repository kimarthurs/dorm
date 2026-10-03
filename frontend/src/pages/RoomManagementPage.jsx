import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api'; 

export default function RoomManagementPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'dormAdmin' && userRole !== 'counselor') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>仅限宿舍管理员或辅导员访问。</h2>
        <button
          className="layui-btn layui-btn-normal"
          onClick={() => navigate(-1)}
        >
          返回上一页
        </button>
      </div>
    );
  }

  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [roomKeyword, setRoomKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [beds, setBeds] = useState([]);
  const [bedsLoading, setBedsLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/dormitories/rooms');
        setRooms(response.data);
        setFilteredRooms(response.data); 
      } catch (error) {
        console.error('获取房间信息失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleSearch = () => {
    const keyword = roomKeyword.trim();
    const results = rooms.filter((room) => {
      const matchesBuilding =
        !selectedBuilding || room.building === selectedBuilding;
      const matchesRoom =
        !keyword || room.roomNo.toLowerCase().includes(keyword.toLowerCase());
      return matchesBuilding && matchesRoom;
    });
    setFilteredRooms(results);
  };

  const handleReset = () => {
    setSelectedBuilding('');
    setRoomKeyword('');
    setFilteredRooms(rooms);
  };

  const handleViewBeds = async (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
    setBedsLoading(true);

    try {
      const response = await apiClient.get(`/api/dormitories/rooms/${room.id}/beds`);
      setBeds(response.data);
    } catch (error) {
      console.error('获取床位信息失败:', error);
      setBeds([]);
    } finally {
      setBedsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    setBeds([]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f8', position: 'relative' }}>
      <div className="vpn-header layui-row" style={{ backgroundImage: 'url("/header.jpg")', padding: '15px 20px', color: 'white' }}>
        <h2 style={{ fontSize: '18px', margin: 0, cursor: 'pointer' }} onClick={() => navigate(-1)}>
          <i className="layui-icon layui-icon-left" style={{ marginRight: '10px' }} />
          宿舍与房间信息管理
        </h2>
      </div>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* 房间筛选区域 */}
        <div style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <form
            className="layui-form"
            style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
          >
            <select className="layui-input" style={{ width: '150px', display: 'block' }} value={selectedBuilding} onChange={(event) => setSelectedBuilding(event.target.value)}>
              <option value="">全部楼栋</option>
              <option value="A栋">A栋</option>
              <option value="B栋">B栋</option>
            </select>
            <input type="text" placeholder="请输入房间号" className="layui-input" style={{ width: '200px' }} value={roomKeyword} onChange={(event) => setRoomKeyword(event.target.value)} />
            <button type="submit" className="layui-btn layui-btn-normal">查询</button>
            <button type="button" className="layui-btn layui-btn-primary" onClick={handleReset}>重置</button>
          </form>
        </div>

        {/* 房间信息列表 */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            宿舍房间列表
          </h3>

          {loading ? (
            <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>
              <i className="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop" style={{ fontSize: '24px', marginRight: '10px' }}></i>
              正在加载房间数据...
            </div>
          ) : (
            <table className="layui-table">
              <thead>
                <tr>
                  <th>楼栋</th>
                  <th>房间号</th>
                  <th>楼层</th>
                  <th>容纳人数</th>
                  <th>已入住人数</th>
                  <th>空闲床位数</th>
                  <th>房间状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.building}</td>
                    <td>{room.roomNo}室</td>
                    <td>{room.floor}层</td>
                    <td>{room.capacity}</td>
                    <td>{room.occupied}</td>
                    <td style={{ color: room.available > 0 ? '#009688' : '#FF5722', fontWeight: 'bold' }}>
                      {room.available}
                    </td>
                    <td>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', color: 'white', fontSize: '12px', backgroundColor: room.status === '正常' ? '#009688' : '#FF5722' }}>
                        {room.status}
                      </span>
                    </td>
                    <td>
                      <button className="layui-btn layui-btn-sm" onClick={() => handleViewBeds(room)}>
                        查看床位
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>未查询到符合条件的房间信息。</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 床位详情弹窗 */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', width: '600px', maxWidth: '90vw', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>
                {selectedRoom?.building} {selectedRoom?.roomNo}室 - 床位详情
              </h3>
              <i className="layui-icon layui-icon-close" style={{ cursor: 'pointer', fontSize: '20px' }} onClick={closeModal} />
            </div>

            {bedsLoading ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                正在加载床位数据...
              </div>
            ) : (
              <table className="layui-table">
                <thead>
                  <tr>
                    <th>床位编号</th>
                    <th>当前状态</th>
                    <th>学生姓名</th>
                    <th>学号</th>
                  </tr>
                </thead>
                <tbody>
                  {beds.map((bed) => (
                    <tr key={bed.bedNo}>
                      <td>{bed.bedNo}</td>
                      <td>
                        <span style={{ color: bed.status === '已占用' ? '#FF5722' : '#009688' }}>
                          {bed.status}
                        </span>
                      </td>
                      <td>{bed.studentName}</td>
                      <td>{bed.studentId}</td>
                    </tr>
                  ))}
                  {beds.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', color: '#999' }}>暂无床位数据</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button className="layui-btn layui-btn-primary" onClick={closeModal}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}