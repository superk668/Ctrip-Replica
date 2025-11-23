import React from 'react';

const DownloadButton = ({ orderId }) => {
  const handleClick = async (e?: any) => {
    try { if (e && typeof e.stopPropagation === 'function') e.stopPropagation(); } catch (_) {}
    console.log('下载订单', orderId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      let phone;
      try {
        const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        phone = u ? JSON.parse(u)?.phone : undefined;
      } catch (_) {}
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      if (phone) headers['x-user-phone'] = String(phone);
      headers['Accept'] = 'text/plain';
      if (!token && !phone) {
        alert('请先登录');
        return;
      }
      const res = await fetch(`/api/orders/${orderId}/download`, { headers });
      if (!res.ok) throw new Error('生成失败，请稍后重试');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disp = res.headers ? res.headers.get('content-disposition') || '' : '';
      const match = disp.match(/filename="?([^";]+)"?/i);
      const filename = match ? match[1] : `${orderId}.txt`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert(e?.message || '生成失败，请稍后重试');
    }
  };

  return <button onClick={handleClick}>下载订单</button>;
};

export default DownloadButton;