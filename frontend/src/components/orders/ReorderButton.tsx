import React from 'react';

// 骨架组件: UI-ReorderButton
const ReorderButton = ({ orderInfo }) => {
  const handleClick = () => {
    // TODO: 实现重新下单的逻辑
    console.log('重新下单', orderInfo);
  };

  return <button onClick={handleClick}>重新下单</button>;
};

export default ReorderButton;