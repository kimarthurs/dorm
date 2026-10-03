import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

export default function ResidenceManagementPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  if (userRole !== 'dormAdmin') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>仅限宿舍管理员访问。</h2>
        <button
          className="layui-btn layui-btn-normal"
          onClick={() => navigate(-1)}
        >
          返回上一页
        </button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    studentId: '',
    building: '',
    roomNo: '',
    bedNo: '',
    checkInDate: new Date().toISOString().split('T')[0],
  });

  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(true);

  useEffect(() => {
    const fetchUnassignedStudents = async () => {
      try {
        setFetchingStudents(true);

        const response = await apiClient.get(
          '/api/residences/unassigned-students'
        );

        setUnassignedStudents(response.data);
      } catch (error) {
        console.error('获取未分配学生列表失败：', error);

        alert(
          error.response?.data?.detail ||
          '未分配学生列表加载失败，请稍后重试。'
        );
      } finally {
        setFetchingStudents(false);
      }
    };

    fetchUnassignedStudents();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAssign = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await apiClient.post('/api/residences/assign', {
        student_no: formData.studentId,
        building_name: formData.building,
        room_no: formData.roomNo.trim(),
        bed_no: formData.bedNo,
        check_in_date: formData.checkInDate,
      });

      alert('床位分配成功。');

      setUnassignedStudents((currentStudents) =>
        currentStudents.filter(
          (student) => student.student_no !== formData.studentId
        )
      );

      setFormData((currentForm) => ({
        studentId: '',
        building: '',
        roomNo: '',
        bedNo: '',
        checkInDate: currentForm.checkInDate,
      }));
    } catch (error) {
      console.error('床位分配失败：', error);

      alert(
        error.response?.data?.detail ||
        '床位分配失败，请检查学生、房间和床位信息。'
      );
    } finally {
      setLoading(false);
    }
  };

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
          onClick={() => navigate('/AdminDashboard')}
        >
          <i
            className="layui-icon layui-icon-left"
            style={{ marginRight: '10px' }}
          />
          学生住宿分配与管理
        </h2>
      </div>

      <div
        style={{
          padding: '20px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '30px',
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
            学生床位分配
          </h3>

          <form className="layui-form" onSubmit={handleAssign}>
            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>
                未分配学生
              </label>

              <div
                className="layui-input-block"
                style={{ marginLeft: '130px' }}
              >
                <select
                  name="studentId"
                  required
                  className="layui-input"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  style={{ display: 'block' }}
                  disabled={fetchingStudents}
                >
                  <option value="">-- 请选择需要分配床位的学生 --</option>

                  {fetchingStudents ? (
                    <option value="" disabled>
                      正在加载学生信息……
                    </option>
                  ) : (
                    unassignedStudents.map((student) => (
                      <option
                        key={student.student_no}
                        value={student.student_no}
                      >
                        {student.name}（{student.student_no}）- {student.college}
                      </option>
                    ))
                  )}
                </select>

                {unassignedStudents.length === 0 && !fetchingStudents && (
                  <div
                    style={{
                      marginTop: '5px',
                      color: '#999',
                      fontSize: '12px',
                    }}
                  >
                    当前没有需要分配床位的学生。
                  </div>
                )}
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>
                宿舍楼
              </label>

              <div
                className="layui-input-block"
                style={{ marginLeft: '130px' }}
              >
                <select
                  name="building"
                  required
                  className="layui-input"
                  value={formData.building}
                  onChange={handleInputChange}
                  style={{ display: 'block' }}
                >
                  <option value="">请选择宿舍楼</option>
                  <option value="A栋">A栋</option>
                  <option value="B栋">B栋</option>
                </select>
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>
                房间号
              </label>

              <div
                className="layui-input-block"
                style={{ marginLeft: '130px' }}
              >
                <input
                  type="text"
                  name="roomNo"
                  required
                  value={formData.roomNo}
                  onChange={handleInputChange}
                  className="layui-input"
                  placeholder="例如：301"
                />
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>
                床位号
              </label>

              <div
                className="layui-input-block"
                style={{ marginLeft: '130px' }}
              >
                <select
                  name="bedNo"
                  required
                  className="layui-input"
                  value={formData.bedNo}
                  onChange={handleInputChange}
                  style={{ display: 'block' }}
                >
                  <option value="">请选择床位</option>
                  <option value="1号床">1号床</option>
                  <option value="2号床">2号床</option>
                  <option value="3号床">3号床</option>
                  <option value="4号床">4号床</option>
                </select>
              </div>
            </div>

            <div className="layui-form-item">
              <label className="layui-form-label" style={{ width: '100px' }}>
                入住日期
              </label>

              <div
                className="layui-input-block"
                style={{ marginLeft: '130px' }}
              >
                <input
                  type="date"
                  name="checkInDate"
                  required
                  value={formData.checkInDate}
                  onChange={handleInputChange}
                  className="layui-input"
                />
              </div>
            </div>

            <div
              className="layui-form-item"
              style={{ textAlign: 'center', marginTop: '30px' }}
            >
              <button
                type="submit"
                className="layui-btn layui-btn-normal"
                style={{ padding: '0 40px' }}
                disabled={
                  loading ||
                  fetchingStudents ||
                  unassignedStudents.length === 0
                }
              >
                {loading ? '正在处理……' : '确认分配'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}