import React, { useState, useEffect } from 'react';
import * as execute from '../contract/execute';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import styled from 'styled-components';
import LoadingIndicator from '../components/LoadingIndicator';
import pipeImg from '../images/pipe.png';
import skyImg from '../images/sky.png';
import groundImg from '../images/ground.png';
import happyFrogImg from '../images/pepe.png';
import sadFrogImg from '../images/sad-pepe.png';


// Game constants
const FROG_SIZE = 40;
const GAME_HEIGHT = 730;
const SKY_HEIGHT = 580;
const GAME_WIDTH = 500;
const STARTING_FROG_POSITION = 250;
const FROG_LEFT_POSITION = 50;
const JUMP_HEIGHT = 50;
const PIPE_WIDTH = 60;
const MIN_PIPE_HEIGHT = 60;
//const pipeGap = 200;


const Play = () => {
    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // terra components
    const connectedWallet = useConnectedWallet();

    // game components
    const [frogPosition, setFrogPosition] = useState(STARTING_FROG_POSITION);
    const [frogImg, setFrogImg] = useState(happyFrogImg);
    const [pipeLeft, setPipeLeft] = useState(GAME_WIDTH);
    const [pipeGap, setPipeGap] = useState(randomInt((4 * FROG_SIZE), (7 * FROG_SIZE)));
    const [topPipeHeight, setTopPipeHeight] = useState(randomInt(MIN_PIPE_HEIGHT, (SKY_HEIGHT - MIN_PIPE_HEIGHT - pipeGap)));
    const bottomPipeHeight = SKY_HEIGHT - pipeGap - topPipeHeight;
    const bottomPipeTop = topPipeHeight + pipeGap;

    // game states
    const [gameHasStarted, setGameHasStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pipesCleared, setPipesCleared] = useState(0);
    const [difficulty, setDifficulty] = useState(1);
    const [score, setScore] = useState(-1);

    const GRAVITY = 1 + (difficulty / 2);
    const SCROLL_SPEED = 3 + (difficulty);

    // animate frog
    useEffect(() => {
        let timeId;
        if (gameHasStarted && !gameOver && frogPosition < (GAME_HEIGHT - FROG_SIZE)) {
            timeId = setInterval(() => {
                setFrogPosition(frogPosition => frogPosition + GRAVITY);
            }, 24)
        }

        return () => {
            clearInterval(timeId);
        };
    }, [frogPosition, gameHasStarted]);

    // animate pipes
    useEffect(() => {
        let pipeId;
        if (gameHasStarted && !gameOver && pipeLeft >= -PIPE_WIDTH) {
            // animate existing pipes
            pipeId = setInterval(() => {
                setPipeLeft((pipeLeft) => pipeLeft - SCROLL_SPEED);
            }, 24)
            return () => {
                clearInterval(pipeId);
            };
        } else if (!gameOver) {
            // generate pipes
            setPipeLeft(GAME_WIDTH);
            setPipeGap(randomInt((3 * FROG_SIZE), (6 * FROG_SIZE)));
            setTopPipeHeight(randomInt(MIN_PIPE_HEIGHT, (SKY_HEIGHT - MIN_PIPE_HEIGHT - pipeGap)));

            // increment score counters
            setPipesCleared(pipesCleared => pipesCleared + 1);
            setDifficulty(1 + Math.floor(pipesCleared / 3));
            setScore(score => score + ( 1 * difficulty));
        }
    }, [gameHasStarted, pipeLeft]);

    // detect collisions
    useEffect(() => {
        // detect if frog collides with ground
        if ( frogPosition >= (SKY_HEIGHT - FROG_SIZE) ) {
            setFrogImg(sadFrogImg);
            setGameOver(true);
        }

        // detect if frog collides with top or bottom pipes
        const hasCollidedWithTopPipe =
            pipeLeft <= (FROG_LEFT_POSITION + FROG_SIZE + 5)
            && (frogPosition + 10) <= (topPipeHeight)

        const hasCollidedWithBottomPipe =
            pipeLeft <= (FROG_LEFT_POSITION + FROG_SIZE + 5) 
            && (frogPosition + FROG_SIZE - 5) >= (SKY_HEIGHT - bottomPipeHeight) 

        if (
            pipeLeft >= 0 &&
            pipeLeft <= (FROG_LEFT_POSITION + FROG_SIZE) &&
            (hasCollidedWithTopPipe || hasCollidedWithBottomPipe)
        ) {
            setFrogImg(sadFrogImg);
            setGameOver(true);
        }
    }, [frogPosition])

    // click to make frog jump
    const handleClick = () => {
        let newFrogPosition = frogPosition - JUMP_HEIGHT;
        if (!gameHasStarted) {
            setGameHasStarted(true)
        } else if (!gameOver && newFrogPosition < 0) {
            setFrogPosition(0);
        } else if (!gameOver) {
            setFrogPosition(newFrogPosition);
        }
    };

    // submit score to Terra on game over
    const submitScore = async () => {
        if (connectedWallet && connectedWallet.network.name === 'testnet') {
            setLoading(true);
            const tx = await execute.setScore(connectedWallet, score);
            console.log(tx);
            alert('Score submitted!');
            setLoading(false);
            window.location.href = '/leaderboard';
        }
    };

    // reset and replay game
    const replayGame = () => {
        window.location.reload();
    }

    const renderGameOver = () => {
        return (
            <div className="game-over">
                <p><span> Game over! </span></p>

                <div className="button-container">
                    <button
                        className="cta-button replay-button"
                        type="button"
                        onClick={() => replayGame()}
                        >
                        Replay Game
                    </button>

                    <button
                        className="cta-button connect-wallet-button"
                        type="button"
                        onClick={() => submitScore()}
                        >
                        Submit Score
                    </button>
                </div>
            </div>
        )
    };

    return (

        <div className="score-board-container">
            <div className="play-container">
                <span>Score: {score}</span>
                <span>Difficulty: {difficulty}</span>
            </div>
            {(gameHasStarted && gameOver && renderGameOver())}

            {loading? (
                <LoadingIndicator />
            ) : (
                <div className="border-container">
                
                    <div className="border-left"></div>
                    <div className="game-container" onClick={handleClick}>

                        

                        <Sky>
                            <Frog size={FROG_SIZE} top={frogPosition} left={FROG_LEFT_POSITION} image={frogImg} />
                            
                        </Sky>
                        <Ground />
                        
                        <TopPipe height={topPipeHeight} width={PIPE_WIDTH} left={pipeLeft} />
                        <BottomPipe height={bottomPipeHeight} width={PIPE_WIDTH} left={pipeLeft} top={bottomPipeTop} />

                    </div>
                    <div className="border-right"></div>
                </div>
            )}
        </div>
    )
};

export default Play;

// Game components
const Frog = styled.div.attrs(props => ({
    style: {
        height: props.size + "px",
        width: props.size + "px",
        left: props.left + "px",
        top: props.top + "px",
    }
}))`
    background: url(${(props)=>props.image}) center;
    background-size: cover;
    position: absolute;
    z-index: +2;
` 

const BottomPipe = styled.div.attrs(props => ({
    style: {
        height: props.height + "px",
        width: props.width + "px",
        left: props.left + "px",
        top: props.top + "px"
    }
}))`
    background-image: url(${pipeImg});
    background-color: green;
    position: absolute;
`

const TopPipe = styled.div.attrs(props => ({
    style: {
        height: props.height + "px",
        width: props.width + "px",
        left: props.left + "px",
        top: "0px"
    }
}))`
    background-image: url(${pipeImg});
    background-color: green;
    transform:scaleY(-1);
    position: absolute;
`

const Sky = styled.div`
    background-image: url(${skyImg});
    background-size: cover;
    background-color: lightblue;
    width: 500px;
    height: 580px;
    position: relative;
`

const Ground = styled.div`
    background-image: url(${groundImg});
    background-size: cover;
    background-color: brown;
    width: 500px;
    height: 150px;
    top: 580px;
    position: absolute;
`


