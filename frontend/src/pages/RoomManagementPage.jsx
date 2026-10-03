import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoomManagementPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'dormAdmin' && userRole !== 'counselor') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>仅限管理员或辅导员访问</h2>
        <button className="layui-btn layui-btn-normal" onClick={() => navigate(-1)}>返回</button>
      </div>
    );
  }

  const [rooms, setRooms] = useState([
    { id: 1, building: 'A栋', roomNo: '301', floor: 3, capacity: 4, occupied: 3, available: 1, status: '正常' },
    { id: 2, building: 'A栋', roomNo: '302', floor: 3, capacity: 4, occupied: 4, available: 0, status: '已满' },
    { id: 3, building: 'B栋', roomNo: '105', floor: 1, capacity: 2, occupied: 1, available: 1, status: '正常' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [beds, setBeds] = useState([]);

  const handleViewBeds = (room) => {
    setSelectedRoom(room);
    
    // 💡 나중에 GET /api/dormitories/rooms/{room.id}/beds API로 교체
    // 지금은 방 번호에 따라 가짜 데이터를 생성해서 보여줍니다.
    const mockBeds = Array.from({ length: room.capacity }, (_, i) => ({
      bedNo: `${i + 1}号床`,
      status: i < room.occupied ? '已占用' : '空闲',
      studentName: i < room.occupied ? (room.roomNo === '301' && i === 0 ? '金将源' : `学生${i + 1}`) : '-',
      studentId: i < room.occupied ? `2026000${i + 1}` : '-'
    }));
    
    setBeds(mockBeds);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f1f5f8', position: 'relative' }}>
      <div className="vpn-header layui-row" style={{ backgroundImage: 'url("/header.jpg")', padding: '15px 20px', color: 'white' }}>
        <h2 style={{ fontSize: '18px', margin: 0, cursor: 'pointer' }} onClick={() => navigate(-1)}>
          <i className="layui-icon layui-icon-left" style={{ marginRight: '10px' }}/>
          宿舍与房间信息管理 (Room Management)
        </h2>
      </div>

      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <form className="layui-form" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <select className="layui-input" style={{ width: '150px', display: 'block' }}>
              <option value="">全部楼栋</option>
              <option value="A栋">A栋</option>
              <option value="B栋">B栋</option>
            </select>
            <input type="text" placeholder="搜索房间号..." className="layui-input" style={{ width: '200px' }} />
            <button type="button" className="layui-btn layui-btn-normal">查询</button>
            <button type="button" className="layui-btn layui-btn-primary">重置</button>
          </form>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <table className="layui-table">
            <thead>
              <tr>
                <th>楼栋</th>
                <th>房间号</th>
                <th>楼层</th>
                <th>容纳人数</th>
                <th>已入住</th>
                <th>空闲床位</th>
                <th>房间状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.building}</td>
                  <td>{room.roomNo}</td>
                  <td>{room.floor}层</td>
                  <td>{room.capacity}</td>
                  <td>{room.occupied}</td>
                  <td style={{ color: room.available > 0 ? '#009688' : '#FF5722', fontWeight: 'bold' }}>
                    {room.available}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: '4px', color: 'white', fontSize: '12px',
                      backgroundColor: room.status === '正常' ? '#009688' : '#FF5722' 
                    }}>
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
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ backgroundColor: 'white', width: '600px', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>
                {selectedRoom?.building} {selectedRoom?.roomNo}室 - 床位详情
              </h3>
              <i className="layui-icon layui-icon-close" style={{ cursor: 'pointer', fontSize: '20px' }} onClick={closeModal} />
            </div>

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
                {beds.map((bed, idx) => (
                  <tr key={idx}>
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
              </tbody>
            </table>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button className="layui-btn layui-btn-primary" onClick={closeModal}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}