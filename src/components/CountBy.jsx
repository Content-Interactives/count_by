import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Container } from './ui/reused-ui/Container.jsx'
import Frog from './Frog.jsx'
import Lilypad from './Lilypad.jsx'

const CountBy = () => {


	return (
        <Container
            text="Count By Practice" 
            showResetButton={false}
            borderColor="#FF7B00"
            showSoundButton={true}
        >
            {/* Intro Text */}
            <div className='text-center text-sm text-gray-500 p-5'>
                Skipper the frog needs to get to the end of the pond to eat the fly! Help him by clicking the right numbers by counting by 2's, 5's, or 10's.
            </div>

            {/* Pond Water BG */}
            <div className='absolute bottom-0 w-[100%] h-[200px] bg-blue-300'></div>

            {/* Frog */}
            <div className='absolute bottom-[50%] left-0 w-[100%] h-[200px] flex justify-center items-center'>
                <Frog />
            </div>

            {/* Lilypad */}
            <div className='absolute bottom-[20%] left-50% w-[100%] h-[200px] flex justify-center gap-3 items-center'>
                <Lilypad />
                <Lilypad />
                <Lilypad />
                <Lilypad />
            </div>

            {/* Buttons and Count */}
        </Container>
)
};


export default CountBy;