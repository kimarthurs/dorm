import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

export default function ItemApprovalPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [reviewingId, setReviewingId] = useState(null);

  // 权限校验：仅宿舍管理员可以访问
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

  // 获取待审核物品出入申请列表
  const loadPendingRequests = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const response = await apiClient.get('/api/items/pending');

      // 后端若直接返回数组，则使用 response.data
      // 后端若返回 { items: [...] }，则改为 response.data.items
      setRequests(response.data);
    } catch (error) {
      console.error('获取待审核申请失败：', error);

      const message =
        error.response?.data?.detail ||
        '待审核申请加载失败，请稍后重试。';

      setErrorMessage(message);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // 页面首次加载时读取数据
  useEffect(() => {
    loadPendingRequests();
  }, []);

  // 审核申请：批准或驳回
  const handleReview = async (requestId, decision) => {
    const promptText =
      decision === '已批准'
        ? '请输入批准意见（可选）：'
        : '请输入驳回原因（必填）：';

    const comment = window.prompt(promptText);

    // 点击取消时，window.prompt 返回 null
    if (comment === null) {
      return;
    }

    // 驳回必须填写意见
    if (decision === '已驳回' && !comment.trim()) {
      alert('驳回申请时必须填写驳回原因。');
      return;
    }

    try {
      setReviewingId(requestId);

      await apiClient.patch(`/api/items/${requestId}/review`, {
        status: decision,
        review_comment: comment.trim(),
      });

      alert(decision === '已批准' ? '申请已批准。' : '申请已驳回。');

      // 审核成功后重新获取待审核列表
      await loadPendingRequests();
    } catch (error) {
      console.error('审核申请失败：', error);

      const message =
        error.response?.data?.detail ||
        '审核失败，请确认申请状态后重试。';

      alert(message);
    } finally {
      setReviewingId(null);
    }
  };

  const getStatusColor = (status) => {
    if (status === '待审核') return '#FFB800';
    if (status === '已批准') return '#009688';
    if (status === '已撤销') return '#999';
    return '#FF5722';
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
          大件物品出入申请审核
        </h2>
      </div>

      <div
        style={{
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, color: '#333' }}>
              待审核物品出入申请
            </h3>

            <button
              className="layui-btn layui-btn-primary layui-btn-sm"
              onClick={loadPendingRequests}
              disabled={loading}
            >
              <i className="layui-icon layui-icon-refresh" />
              刷新列表
            </button>
          </div>

          {errorMessage && (
            <div
              style={{
                marginBottom: '15px',
                padding: '10px',
                color: '#a94442',
                backgroundColor: '#f2dede',
                border: '1px solid #ebccd1',
                borderRadius: '4px',
              }}
            >
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              正在加载待审核申请……
            </div>
          ) : (
            <table className="layui-table">
              <thead>
                <tr>
                  <th>申请编号</th>
                  <th>学生姓名</th>
                  <th>宿舍信息</th>
                  <th>物品名称</th>
                  <th>类型</th>
                  <th>预计时间</th>
                  <th>申请原因</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>REQ-{String(request.id).padStart(4, '0')}</td>

                    <td>
                      {request.student_name || request.studentName || '-'}
                      <br />
                      <span style={{ fontSize: '12px', color: '#888' }}>
                        {request.student_no || request.studentNo || ''}
                      </span>
                    </td>

                    <td>
                      {request.residence ||
                        request.residence_info ||
                        '暂无住宿信息'}
                    </td>

                    <td>{request.item_name || request.itemName}</td>

                    <td>{request.access_type || request.type}</td>

                    <td>
                      {request.planned_time ||
                        request.expected_time ||
                        request.expectedTime ||
                        '-'}
                    </td>

                    <td>{request.reason || '-'}</td>

                    <td>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          color: 'white',
                          fontSize: '12px',
                          backgroundColor: getStatusColor(request.status),
                        }}
                      >
                        {request.status}
                      </span>

                      {(request.review_comment || request.reviewComment) && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#666',
                            marginTop: '4px',
                          }}
                        >
                          意见：
                          {request.review_comment || request.reviewComment}
                        </div>
                      )}
                    </td>

                    <td>
                      {request.status === '待审核' ? (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            className="layui-btn layui-btn-sm layui-btn-normal"
                            onClick={() =>
                              handleReview(request.id, '已批准')
                            }
                            disabled={reviewingId === request.id}
                          >
                            {reviewingId === request.id ? '处理中…' : '批准'}
                          </button>

                          <button
                            className="layui-btn layui-btn-sm layui-btn-danger"
                            onClick={() =>
                              handleReview(request.id, '已驳回')
                            }
                            disabled={reviewingId === request.id}
                          >
                            {reviewingId === request.id ? '处理中…' : '驳回'}
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#999', fontSize: '12px' }}>
                          已处理完毕
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {requests.length === 0 && (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center' }}>
                      暂无待审核申请。
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