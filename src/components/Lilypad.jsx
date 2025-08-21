import React from 'react';

const Lilypad = () => {
  return (
    // Lilypad Body
    <div style={{
        width: '80px',
        height: '10px',
        backgroundColor: '#4da85d',
        borderRadius: '50% 50% 50% 50%',
    }}>
      {/* Lilypad Cut */}
      <div style={{
        width: '0',
        height: '0',
        borderLeft: '0px solid transparent',
        borderRight: '5px solid transparent',
        borderBottom: '20px solid #93c5fd', // bg-blue-300 equivalent
        position: 'relative',
        transform: 'translate(65px, -3px) rotate(-70deg)',
      }}></div>
    </div>
  );
};

export default Lilypad;
