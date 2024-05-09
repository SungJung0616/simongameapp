import React, { useEffect, useState } from 'react';
import greenSound from './sounds/green.mp3';
import yellowSound from './sounds/yellow.mp3';
import redSound from './sounds/red.mp3';
import blueSound from './sounds/blue.mp3';
import wrongSound from './sounds/wrong.mp3';
import './App.css';

function App() {
  const [level, setLevel] = useState(0); 
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(false);
  const [gamePattern, setGamePattern] = useState([]);
  const [userClickedPattern, setUserClickedPattern] = useState([]);
  const [activeColor, setActiveColor] = useState("");
  const buttonColours = ["green", "yellow", "red", "blue"];

  useEffect(() => {
    if (level > 0) {
      const newScore = score + 100;
      setScore(newScore);
      setBestScore(currentBest => Math.max(currentBest, newScore));
    } else {
      setScore(0);
    }
  }, [level])

  useEffect(() => {
    // Registers event listeners if the game has not started.
    if (!start) {
      const handleStart = (event) => {
        if (!start) {      
          setTitle("Level " + level);
          
          nextSequence();
          setStart(true);
          
        }
      };
      
      document.addEventListener('keyup', handleStart);
      document.addEventListener('touchend', handleStart);
      

      // Cleans up event listeners when the component is unmounted.
      return () => {
        document.removeEventListener('keyup', handleStart);
        document.removeEventListener('touchend', handleStart);
      };
    }
  }, [start, level]);  

  useEffect(() => {
    if (start && userClickedPattern.length > 0 && userClickedPattern.length <= gamePattern.length) {
      const lastIndex = userClickedPattern.length - 1;
       checkAnswer(lastIndex);
    }
  }, [userClickedPattern]);

  useEffect(() => {
    if (start) {
      setTitle("Level " + level);
    } else {
      setTitle("Press Screen or keyboard to Start");
    }
  }, [level, start]);

  const playSound = (name) => {    
    let soundUrl;
    switch (name) {
      case 'green':
        soundUrl = greenSound;
        break;
      case 'yellow':
        soundUrl = yellowSound;
        break;
      case 'red':
        soundUrl = redSound;
        break;
      case 'blue':
        soundUrl = blueSound;
        break;
      case 'wrong':
        soundUrl = wrongSound;
        break;
      default:
        return;
    }
    const audio = new Audio(soundUrl);
    audio.play();
  };

  //Generates the next sequence and adds it to the game pattern.
  const nextSequence = () => {
    setUserClickedPattern([]);
    setLevel(prevLevel => prevLevel + 1);
    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = buttonColours[randomNumber];
    playSound(randomChosenColour);
    animateColor(randomChosenColour);
    setGamePattern(prevPattern => [...prevPattern, randomChosenColour]);    
  };

  const buttonClick = (color) => {  
    console.log(level)  
    if (start && level >= 1) {  // 버튼이 활성화 되어야 하는 조건
      animateColor(color);  
      playSound(color);       
      setUserClickedPattern(prevPattern => [...prevPattern, color]);
    }
  };

  const startOver = () => {
    setTitle("Game Over!!");
    playSound('wrong');
    setTimeout(() => {
      setTitle("Press Screen or button to Start");
      setLevel(0);
      setGamePattern([]);
      setUserClickedPattern([]);
      setStart(false);
      setScore(0); // 점수 초기화
    }, 2000);
  };

  const checkAnswer = (lastIndex) => {    
    if (gamePattern[lastIndex] !== userClickedPattern[lastIndex]) {      
      startOver();
    } else if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  };  

  // Activates the animation for the selected color..  
  const animateColor = (color) => {   
    setActiveColor(color);
    setTimeout(() => {
      setActiveColor("");
    }, 300); 
  };

  return (
    <div className="container">
    <h2>{title}</h2>
    <div className="Row">
      {buttonColours.slice(0, 2).map(color => (
        <div key={color} onClick={() => buttonClick(color)} type="button" 
        className={`btn ${color} ${activeColor === color ? 'pressed' : ''}`}></div>
      ))}
    </div>
    <div className="Row">
      {buttonColours.slice(2, 4).map(color => (
        <div key={color} 
             onClick={() => buttonClick(color)} 
             type="button" 
             className={`btn ${color} ${activeColor === color ? 'pressed' : ''}`}>          
             </div>
      ))}
    </div>
    <div className="scoreboard">
      <div className="score">Score: {score}</div>
      <div className="best-score">Best Score: {bestScore}</div>
    </div>
  </div>
  );
}

export default App;
