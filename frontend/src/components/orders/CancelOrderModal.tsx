import React from 'react';

// 骨架组件: UI-CancelOrderModal
const CancelOrderModal = ({ onConfirm, onCancel }) => {
  // TODO: 实现取消订单弹窗的逻辑
  // 依赖: API-POST-CancelOrder
  return (
    <div>
      <h2>确认取消订单？</h2>
      <button onClick={onConfirm}>确认</button>
      <button onClick={onCancel}>关闭</button>
    </div>
  );
};

export default CancelOrderModal;