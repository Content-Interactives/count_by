import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Container } from './ui/reused-ui/Container.jsx'
import Frog from './Frog.jsx'
import Lilypad from './Lilypad.jsx'

import '../components/ui/reused-animations/fade.css'
import './CountBy.css'

const CountBy = () => {
    // Helper function to generate randomized lilypad values
    const generateLilypadValues = (countValue) => {
        const newLilypads = [];
        // Start from a random multiple (1-6 times the count value)
        const startingMultiple = Math.floor(Math.random() * 6) + 1;
        // Add a random offset (1-9) to make non-multiples
        const randomOffset = Math.floor(Math.random() * 9) + 1;
        
        for (let i = 0; i < 4; i++) {
            newLilypads.push((countValue * (startingMultiple + i)) + randomOffset);
        }
        return newLilypads;
    };
    
    // Create a shuffled cycle of counts [2, 5, 10, 100]
    const createShuffledSequence = () => {
        const options = [2, 5, 10, 100];
        return options.sort(() => Math.random() - 0.5);
    };

    // State Management
    const [countSequence, setCountSequence] = useState(createShuffledSequence);
    const [countIndex, setCountIndex] = useState(0);
    const [count, setCount] = useState(() => countSequence[0]);
    const initialLilypads = generateLilypadValues(countSequence[0]);
    const [lilypads, setLilypads] = useState(initialLilypads);
    const [frogPosition, setFrogPosition] = useState(0);
    const [buttonValues, setButtonValues] = useState(() => {
        const correctAnswer = initialLilypads[0] + countSequence[0];
        const incorrectValue1 = correctAnswer + countSequence[0];
        const incorrectValue2 = correctAnswer - countSequence[0];
        const allValues = [correctAnswer, incorrectValue1, incorrectValue2];
        return allValues.sort(() => Math.random() - 0.5);
    });
    const [frogLeft, setFrogLeft] = useState(0);
    const [showGoodJob, setShowGoodJob] = useState(false);
    const [showCountAndButtons, setShowCountAndButtons] = useState(true);
    const [buttonsAnimating, setButtonsAnimating] = useState('normal');
    const [shakingButtonIndex, setShakingButtonIndex] = useState(null);
    const [isJumping, setIsJumping] = useState(false);

    // Refs for lilypad positions
    const lilypadRefs = useRef([]);

    // Hover detection system
    useEffect(() => {
        function watchForHover() {
            // lastTouchTime is used for ignoring emulated mousemove events
            let lastTouchTime = 0

            function enableHover() {
                if (new Date() - lastTouchTime < 500) return
                document.body.classList.add('hasHover')
            }

            function disableHover() {
                document.body.classList.remove('hasHover')
            }

            function updateLastTouchTime() {
                lastTouchTime = new Date()
            }

            document.addEventListener('touchstart', updateLastTouchTime, true)
            document.addEventListener('touchstart', disableHover, true)
            document.addEventListener('mousemove', enableHover, true)

            enableHover()

            // Return cleanup function
            return () => {
                document.removeEventListener('touchstart', updateLastTouchTime, true)
                document.removeEventListener('touchstart', disableHover, true)
                document.removeEventListener('mousemove', enableHover, true)
            }
        }

        const cleanup = watchForHover();
        return cleanup;
    }, []);

    // Helper function to calculate frog position for a given lilypad
    const calculateFrogPosition = (targetPosition) => {
        if (lilypadRefs.current[targetPosition]) {
            const lilypadElement = lilypadRefs.current[targetPosition];
            const lilypadRect = lilypadElement.getBoundingClientRect();
            const container = lilypadElement.parentElement;
            const containerRect = container.getBoundingClientRect();
            
            if (containerRect) {
                return lilypadRect.left - containerRect.left + (lilypadRect.width / 2);
            }
        }
        return frogLeft;
    };

    // Update frog position based on lilypad positions
    useEffect(() => {
        const updateFrogPosition = () => {
            if (lilypadRefs.current[frogPosition]) {
                const lilypadElement = lilypadRefs.current[frogPosition];
                const lilypadRect = lilypadElement.getBoundingClientRect();
                const container = lilypadElement.parentElement;
                const containerRect = container.getBoundingClientRect();
                
                if (containerRect) {
                    const relativeLeft = lilypadRect.left - containerRect.left + (lilypadRect.width / 2);
                    setFrogLeft(relativeLeft);
                }
            }
        };

        updateFrogPosition();
        window.addEventListener('resize', updateFrogPosition);
        
        return () => window.removeEventListener('resize', updateFrogPosition);
    }, [frogPosition]);

    // Update frog position when game resets (without animation)
    useEffect(() => {
        if (frogPosition === 0 && !isJumping) {
            const newFrogLeft = calculateFrogPosition(0);
            setFrogLeft(newFrogLeft);
        }
    }, [lilypads]); // Update when lilypads change (new game)

    // Functions
    const handleButtonClick = (value) => {
        if (lilypads[frogPosition] + count === value) {
            const newPosition = frogPosition + 1;
            
            // Calculate target position for jump
            const targetFrogLeft = calculateFrogPosition(newPosition);
            
            // Set up jump animation with CSS variables
            const frogElement = document.querySelector('.frog-jump-animation, .transition-all');
            if (frogElement) {
                frogElement.style.setProperty('--start-x', `${frogLeft}px`);
                frogElement.style.setProperty('--end-x', `${targetFrogLeft}px`);
            }
            
            // Start jump animation
            setIsJumping(true);
            
            // After jump completes, update position and handle game logic
            setTimeout(() => {
                setFrogPosition(newPosition);
                setFrogLeft(targetFrogLeft);
                setIsJumping(false);
                
                // Check if frog reached the final lilypad
                if (newPosition === lilypads.length - 1) {
                    // Fade out count and buttons, show good job message
                    setShowCountAndButtons(false);
                    
                    setTimeout(() => {
                        setShowGoodJob(true);
                        
                        // Trigger confetti for completing the sequence
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.4 }
                        });
                    }, 300); // Small delay for fade out to complete
                    
                    // Reset and advance cycle after 3 seconds
                    setTimeout(() => {
                        // Fade out good job message
                        setShowGoodJob(false);
                        
                        // Reset frog position
                        setFrogPosition(0);
                        
                        // Advance to next count in the shuffled cycle; reshuffle at end
                        let nextIndex = countIndex + 1;
                        let nextSequence = countSequence;
                        if (nextIndex >= countSequence.length) {
                            nextSequence = createShuffledSequence();
                            nextIndex = 0;
                            setCountSequence(nextSequence);
                            setCountIndex(0);
                        } else {
                            setCountIndex(nextIndex);
                        }
                        const newCount = nextSequence[nextIndex];
                        setCount(newCount);
                        
                        // Generate new lilypad values based on new count
                        const newLilypads = generateLilypadValues(newCount);
                        setLilypads(newLilypads);
                        
                        // Generate new button values for the first lilypad
                        const correctAnswer = newLilypads[0] + newCount;
                        const incorrectValue1 = correctAnswer + newCount;
                        const incorrectValue2 = correctAnswer - newCount;
                        const allValues = [correctAnswer, incorrectValue1, incorrectValue2];
                        const shuffledValues = allValues.sort(() => Math.random() - 0.5);
                        setButtonValues(shuffledValues);
                        
                        // Fade count and buttons back in
                        setTimeout(() => {
                            setShowCountAndButtons(true);
                        }, 300);
                    }, 3000);
                    
                } else {
                    // Regular correct answer - animate buttons after jump
                    setButtonsAnimating('fading-out');
                    
                    // After fade-out completes, update button values and fade back in
                    setTimeout(() => {
                        // Generate new button values for next lilypad
                        const correctAnswer = lilypads[newPosition] + count;
                        
                        // Generate two incorrect values that are close to the correct answer
                        const incorrectValue1 = correctAnswer + count; // One count interval higher
                        const incorrectValue2 = correctAnswer - count; // One count interval lower
                        
                        // Randomly shuffle the position of the correct answer among the three buttons
                        const allValues = [correctAnswer, incorrectValue1, incorrectValue2];
                        const shuffledValues = allValues.sort(() => Math.random() - 0.5);
                        
                        setButtonValues(shuffledValues);
                        setButtonsAnimating('fading-in');
                        
                        // After fade-in completes, return to normal
                        setTimeout(() => {
                            setButtonsAnimating('normal');
                        }, 300); // Wait for fade-in-up animation to complete (0.3s)
                    }, 500); // Wait for fade-out-up animation to complete (0.5s)
                }
            }, 800); // Wait for jump animation to complete (now 0.8s)
            
        } else {
            // Incorrect answer - shake the clicked button
            const buttonIndex = buttonValues.findIndex(buttonValue => buttonValue === value);
            setShakingButtonIndex(buttonIndex);
            
            // Reset shake animation after it completes
            setTimeout(() => {
                setShakingButtonIndex(null);
            }, 800); // Wait for shake animation to complete (now 0.8s)
        }
    }
    
	return (
        <Container
            text="Count By Practice" 
            showResetButton={false}
            borderColor="#FF7B00"
            showSoundButton={true}
        >
            {/* Intro Text */}
            <div className='text-center text-sm text-gray-500 p-5'>
                Skipper the frog needs to get to the end of the pond! Help him by clicking the right numbers by counting by 2's, 5's, 10's, or 100's.
            </div>

            {/* Pond Water BG */}
            <div className='absolute bottom-0 w-[100%] h-[200px] bg-blue-300'></div>

            {/* Lilypads */}
            <div className='absolute bottom-[18%] w-[100%] h-[200px] flex justify-between items-center'>
                {/* Frog */}
                <div 
                    className={`absolute bottom-[15%] h-[200px] flex justify-center items-center ${
                        isJumping ? 'frog-jump-animation' : 'transition-all duration-500 ease-in-out'
                    }`}
                    style={{
                        ...(isJumping ? {} : {
                            left: `${frogLeft}px`,
                            transform: 'translateX(-50%)'
                        }),
                        '--start-x': `${frogLeft}px`,
                        '--end-x': `${frogLeft}px`
                    }}
                >
                    <Frog isJumping={isJumping} />
                </div>

                <div 
                    className='flex flex-col items-center'
                    ref={el => lilypadRefs.current[0] = el}
                >
                    <Lilypad />
                    <div className='text-sm text-gray-500 bg-white border border-gray-500 rounded-lg font-bold p-2 w-[auto] h-[20px] translate-y-[5px] flex justify-center items-center'>
                        {`${frogPosition >= 0 ? lilypads[0] : '?'}`}
                    </div>
                </div>
                <div 
                    className='flex flex-col items-center'
                    ref={el => lilypadRefs.current[1] = el}
                >
                    <Lilypad />
                    <div className='text-sm text-gray-500 bg-white border border-gray-500 rounded-lg font-bold p-2 w-[auto] h-[20px] translate-y-[5px] flex justify-center items-center'>
                        {`${frogPosition >= 1 ? lilypads[1] : '?'}`}
                    </div>
                </div>
                <div 
                    className='flex flex-col items-center'
                    ref={el => lilypadRefs.current[2] = el}
                >
                    <Lilypad />
                    <div className='text-sm text-gray-500 bg-white border border-gray-500 rounded-lg font-bold p-2 w-[auto] h-[20px] translate-y-[5px] flex justify-center items-center'>
                        {`${frogPosition >= 2 ? lilypads[2] : '?'}`}
                    </div>
                </div>
                <div 
                    className='flex flex-col items-center'
                    ref={el => lilypadRefs.current[3] = el}
                >
                    <Lilypad />
                    <div className='text-sm text-gray-500 bg-white border border-gray-500 rounded-lg font-bold p-2 w-[auto] h-[20px] translate-y-[5px] flex justify-center items-center'>
                        {`${frogPosition >= 3 ? lilypads[3] : '?'}`}
                    </div>
                </div>
            </div>

            {/* Buttons and Count */}
            <div className={`absolute bottom-[14%] w-[100%] flex justify-center items-center gap-3 transition-opacity duration-300 ${showCountAndButtons ? 'opacity-100' : 'opacity-0'}`}>
                <button className={`count-by-button w-[30%] h-[80px] ml-5 bg-green-200 border border-green-500 border-2 rounded-lg text-3xl font-extrabold text-green-700 flex justify-center items-center transition-all duration-200 ${
                    buttonsAnimating === 'fading-out' ? 'fade-out-up-animation' : 
                    buttonsAnimating === 'fading-in' ? 'fade-in-up-animation' : ''
                } ${shakingButtonIndex === 0 ? 'shake-animation' : ''}`}
                    onClick={() => handleButtonClick(buttonValues[0])}
                    disabled={!showCountAndButtons || buttonsAnimating !== 'normal' || shakingButtonIndex !== null || isJumping}
                >
                    {buttonValues[0]}
                </button>
                <button className={`count-by-button w-[30%] h-[80px] bg-green-200 border border-green-500 border-2 rounded-lg text-3xl font-extrabold text-green-700 flex justify-center items-center transition-all duration-200 ${
                    buttonsAnimating === 'fading-out' ? 'fade-out-up-animation' : 
                    buttonsAnimating === 'fading-in' ? 'fade-in-up-animation' : ''
                } ${shakingButtonIndex === 1 ? 'shake-animation' : ''}`}
                    onClick={() => handleButtonClick(buttonValues[1])}
                    disabled={!showCountAndButtons || buttonsAnimating !== 'normal' || shakingButtonIndex !== null || isJumping}
                >
                    {buttonValues[1]}
                </button>
                <button className={`count-by-button w-[30%] h-[80px] mr-5 bg-green-200 border border-green-500 border-2 rounded-lg text-3xl font-extrabold text-green-700 flex justify-center items-center transition-all duration-200 ${
                    buttonsAnimating === 'fading-out' ? 'fade-out-up-animation' : 
                    buttonsAnimating === 'fading-in' ? 'fade-in-up-animation' : ''
                } ${shakingButtonIndex === 2 ? 'shake-animation' : ''}`}
                    onClick={() => handleButtonClick(buttonValues[2])}
                    disabled={!showCountAndButtons || buttonsAnimating !== 'normal' || shakingButtonIndex !== null || isJumping}
                >
                    {buttonValues[2]}
                </button>
            </div>
            <div className={`absolute bottom-[4%] left-0 w-[100%] text-center text-2xl font-extrabold text-amber-600 flex justify-center transition-opacity duration-300 ${showCountAndButtons ? 'opacity-100' : 'opacity-0'}`}>
                Count by {count}'s!
            </div>

            {/* Good Job Message */}
            <div className={`absolute bottom-[20%] left-0 w-[100%] text-center text-5xl font-extrabold text-green-600 flex justify-center transition-opacity duration-300 ${showGoodJob ? 'opacity-100' : 'opacity-0 z-[-10]'}`}>
                Great Job!
            </div>

        </Container>
)
};


export default CountBy;