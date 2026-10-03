import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ItemRequestPage() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || '金将源';
  const userRole = localStorage.getItem('userRole');

  // 권한 방어 (학생이 아니면 튕겨냄)
  if (userRole !== 'student') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>접근 권한이 없습니다.</h2>
        <button className="layui-btn layui-btn-normal" onClick={() => navigate(-1)}>뒤로 가기</button>
      </div>
    );
  }

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    itemName: '',
    type: '반입', // 반입(In) or 반출(Out)
    expectedTime: '',
    reason: ''
  });

  // 하드코딩된 내 신청 내역 (나중에 GET API로 교체)
  const [myRequests, setMyRequests] = useState([
    { id: 1, itemName: '데스크탑 PC', type: '반입', expectedTime: '2026-10-05 14:00', status: '待审核', reason: '과제용 PC 반입' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 💡 나중에 이 부분에 POST /api/items/request API 호출 로직이 들어갑니다.
    const newRequest = {
      id: Date.now(),
      ...formData,
      status: '待审核'
    };
    setMyRequests([newRequest, ...myRequests]);
    alert('신청이 완료되었습니다.');
    setFormData({ itemName: '', type: '반입', expectedTime: '', reason: '' }); // 폼 초기화
  };

  const handleCancel = (id) => {
    if(window.confirm('이 신청을 철회하시겠습니까?')) {
      // 💡 나중에 이 부분에 DELETE 또는 상태 변경 API 호출 로직이 들어갑니다.
      setMyRequests(myRequests.map(req => req.id === id ? { ...req, status: '已撤销' } : req));
    }
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f1f5f8' }}>
      {/* 헤더 생략 (대시보드와 동일한 헤더를 재사용하거나 간략히 표시) */}
      <div className="vpn-header layui-row" style={{ backgroundImage: 'url("/header.jpg")', padding: '15px 20px', color: 'white' }}>
        <h2 style={{ fontSize: '18px', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/StudentDashboard')}>
          <i className="layui-icon layui-icon-left" style={{ marginRight: '10px' }}/>
          대형 물품 반입/반출 신청 (大件物品出入申请)
        </h2>
      </div>

      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        {/* 1. 신청 폼 영역 */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>새 신청 작성</h3>
          <form className="layui-form" onSubmit={handleSubmit}>
            
            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>물품명 (物品名)</label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <input type="text" name="itemName" required value={formData.itemName} onChange={handleInputChange} className="layui-input" placeholder="예: 모니터, 자전거 등" />
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>종류 (类型)</label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <select name="type" className="layui-input" value={formData.type} onChange={handleInputChange} style={{ display: 'block' }}>
                  <option value="반입">반입 (带入)</option>
                  <option value="반출">반출 (带出)</option>
                </select>
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>예정 시간 (时间)</label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <input type="datetime-local" name="expectedTime" required value={formData.expectedTime} onChange={handleInputChange} className="layui-input" />
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>사유 (原因)</label>
              <div className="layui-input-block" style={{ marginLeft: '130px' }}>
                <textarea name="reason" required value={formData.reason} onChange={handleInputChange} className="layui-textarea" placeholder="신청 사유를 상세히 적어주세요."></textarea>
              </div>
            </div>

            <div className="layui-form-item" style={{ textAlign: 'center', marginTop: '20px' }}>
              <button type="submit" className="layui-btn layui-btn-normal" style={{ padding: '0 30px' }}>제출 (提交)</button>
            </div>
          </form>
        </div>

        {/* 2. 내 신청 내역 조회 영역 */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#333' }}>내 신청 내역 (我的申请记录)</h3>
          <table className="layui-table">
            <thead>
              <tr>
                <th>신청 번호</th>
                <th>물품명</th>
                <th>유형</th>
                <th>예정 시간</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((req, index) => (
                <tr key={req.id}>
                  <td>REQ-{req.id.toString().slice(-4)}</td>
                  <td>{req.itemName}</td>
                  <td>{req.type}</td>
                  <td>{req.expectedTime}</td>
                  <td>
                    {/* 상태별 배지 색상 */}
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '12px',
                      backgroundColor: req.status === '待审核' ? '#FFB800' : 
                                       req.status === '已批准' ? '#009688' : 
                                       req.status === '已撤销' ? '#999' : '#FF5722' 
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === '待审核' && (
                      <button className="layui-btn layui-btn-danger layui-btn-sm" onClick={() => handleCancel(req.id)}>철회(撤销)</button>
                    )}
                  </td>
                </tr>
              ))}
              {myRequests.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>신청 내역이 없습니다.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}