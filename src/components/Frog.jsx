import React from 'react';
import './Frog.css';

const Frog = ({ isJumping = false }) => {
  return (
    // Body
    <div
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: '#22c55e',
        borderRadius: '50% 50% 35% 30%',
        scale: '0.8',
      }}
    >
        {/* Left Eye */}
        <div style={{
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            border: '3px solid #22c55e',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '2px',
            margin: '20px 0',
            position: 'absolute',
            transform: 'translate(-8px, -10px)',
            zIndex: '10'
        }}>
            <div style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: 'black'
            }}></div>
        </div>

        {/* Right Eye */}
        <div style={{
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            border: '3px solid #22c55e',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '2px',
            margin: '20px 0',
            position: 'absolute',
            transform: 'translate(35px, -20px)',
            zIndex: '10'
        }}>
            <div style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: 'black',
                    position: 'absolute',
                    zIndex: '12',
            }}></div>
        </div>

        {/* Smile */}
        {/* <svg 
          style={{
            position: 'absolute',
            transform: 'translate(15px, 25px)',
            zIndex: '10',
            rotate: '-15deg',
            position: 'absolute',
            zIndex: '20',
          }}
          width="20" 
          height="10"
        >
          <path 
            d="M 2 2 Q 10 8 18 2" 
            stroke="black" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
          />
        </svg> */}

        {/* Belly Color */}
        <div
            style={{
                width: '30px',
                height: '30px',
                backgroundColor: '#8bff52',
                borderRadius: '50% 50% 40% 30%',
                transform: 'translate(14px, 20px)',
                zIndex: '10',
                position: 'absolute',
            }}
        ></div>

        {/* Arms */}
        <div style={{
            position: 'absolute',
            transform: 'translate(-6px, 45px) rotate(-10deg)',
            zIndex: '12',
        }}>
            <div className='w-[4px] h-[10px] bg-[#22c55e] rounded-sm absolute translate-x-[30px] translate-y-[5px] rotate-[10deg]'>
            </div>
            <div className='w-[4px] h-[10px] bg-[#22c55e] rounded-sm absolute translate-x-[40px] translate-y-[5px] rotate-[10deg]'>
            </div>
        </div>

        {/* Left Leg */}
        <div 
            className={isJumping ? 'left-leg-animation' : ''}
            style={{
                width: '20px',
                height: '6px',
                backgroundColor: '#22c55e',
                borderRadius: '3px',
                position: 'absolute',
                ...(!isJumping && { transform: 'translate(-6px, 45px) rotate(-10deg)' }),
                zIndex: '5',
            }}
        ></div>
        {/* Right Leg */}
        <div 
            className={isJumping ? 'right-leg-animation' : ''}
            style={{
                width: '20px',
                height: '6px',
                backgroundColor: '#22c55e',
                borderRadius: '3px',
                position: 'absolute',
                ...(!isJumping && { transform: 'translate(38px, 43px) rotate(10deg)' }),
                zIndex: '1',
            }}
        ></div>
    </div>
  );
};

export default Frog;
