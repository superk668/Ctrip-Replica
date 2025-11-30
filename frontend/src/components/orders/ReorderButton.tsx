import React from 'react';

const ReorderButton = ({ orderInfo }) => {
  const handleClick = () => {
    console.log('重新下单', orderInfo);
  };

  return <button onClick={handleClick}>重新下单</button>;
};

export default ReorderButton;

