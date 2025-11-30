import React from 'react';

const CancelOrderModal = ({ onConfirm, onCancel }) => {
  return (
    <div>
      <h2>确认取消订单？</h2>
      <button onClick={onConfirm}>确认</button>
      <button onClick={onCancel}>关闭</button>
    </div>
  );
};

export default CancelOrderModal;

