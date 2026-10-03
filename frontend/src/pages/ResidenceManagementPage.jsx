import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResidenceManagementPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'dormAdmin') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>仅限管理员访问</h2>
        <button className="layui-btn layui-btn-normal" onClick={() => navigate(-1)}>返回上一页</button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    studentId: '',
    building: '',
    roomNo: '',
    bedNo: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAssign = (e) => {
    e.preventDefault();
    // 💡 실제 구현 시 POST /api/residences/assign API 호출
    alert(`分配好了：学号 ${formData.studentId} ➔ ${formData.building} ${formData.roomNo}室 ${formData.bedNo}床`);
    setFormData({ studentId: '', building: '', roomNo: '', bedNo: '' });
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f1f5f8' }}>
      <div className="vpn-header layui-row" style={{ backgroundImage: 'url("/header.jpg")', padding: '15px 20px', color: 'white' }}>
        <h2 style={{ fontSize: '18px', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/AdminDashboard')}>
          <i className="layui-icon layui-icon-left" style={{ marginRight: '10px' }}/>
          学生住宿分配与管理 (Residence Management)
        </h2>
      </div>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>
            安排床位
          </h3>
          
          <form className="layui-form" onSubmit={handleAssign}>
            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>学生学号</label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <input type="text" name="studentId" required value={formData.studentId} onChange={handleInputChange} className="layui-input" placeholder="如: 1820231157" />
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>宿舍楼</label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <select name="building" required className="layui-input" value={formData.building} onChange={handleInputChange} style={{ display: 'block' }}>
                  <option value="">楼栋选择</option>
                  <option value="A栋">A栋</option>
                  <option value="B栋">B栋</option>
                </select>
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>房间号</label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <input type="text" name="roomNo" required value={formData.roomNo} onChange={handleInputChange} className="layui-input" placeholder="如: 301" />
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>床位号</label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <select name="bedNo" required className="layui-input" value={formData.bedNo} onChange={handleInputChange} style={{ display: 'block' }}>
                  <option value="">床位选择 </option>
                  <option value="1">1号床</option>
                  <option value="2">2号床</option>
                  <option value="3">3号床</option>
                  <option value="4">4号床</option>
                </select>
              </div>
            </div>

            <div className="layui-form-item" style={{ textAlign: 'center', marginTop: '30px' }}>
              <button type="submit" className="layui-btn layui-btn-normal" style={{ padding: '0 40px' }}>确认分配</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}