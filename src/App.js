import React, { useEffect, useState } from 'react';
import greenSound from './sounds/green.mp3';
import yellowSound from './sounds/yellow.mp3';
import redSound from './sounds/red.mp3';
import blueSound from './sounds/blue.mp3';
import wrongSound from './sounds/wrong.mp3';
import './App.css';

function App() {
  const [level, setLevel] = useState(0); 
  const [title, setTitle] = useState("Welcome!! Press Screen or keyboard to Start");
  const [start, setStart] = useState(false);
  const [gamePattern, setGamePattern] = useState([]);
  const [userClickedPattern, setUserClickedPattern] = useState([]);
  const [activeColor, setActiveColor] = useState("");

  const buttonColours = ["green", "yellow", "red", "blue"];

  

  useEffect(() => {
    // 게임이 시작되지 않았다면 이벤트 리스너 등록
    if (!start) {
      const handleStart = (event) => {
        if (!start) {      
          setTitle("Level " + level);
          nextSequence();
          setStart(true);
        }
      };

      document.addEventListener('keydown', handleStart);
      document.addEventListener('touchstart', handleStart);

      // 컴포넌트 언마운트 시 이벤트 리스너 정리
      return () => {
        document.removeEventListener('keydown', handleStart);
        document.removeEventListener('touchstart', handleStart);
      };
    }
  }, [start, level]);  // 의존성 배열에 start와 level 추가

  useEffect(() => {
    if (start && userClickedPattern.length > 0 && userClickedPattern.length <= gamePattern.length) {
      console.log("userClickedPattern",userClickedPattern.length);
      console.log("gamePattern",gamePattern.length);
      const lastIndex = userClickedPattern.length - 1;
      console.log("lastIndex",lastIndex);   
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
    console.log("playSound");
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

  const nextSequence = () => {
    console.log("nextSequence");
    setUserClickedPattern([]);
    setLevel(prevLevel => prevLevel + 1);
    console.log("level: ", level);
    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = buttonColours[randomNumber];
    playSound(randomChosenColour);
    animateColor(randomChosenColour);
    console.log("randomChosenColour: ", randomChosenColour);
    setGamePattern(prevPattern => [...prevPattern, randomChosenColour]);
    console.log("gamePattern: ", gamePattern);
  };

  const buttonClick = (color) => {
    console.log(`${color} button clicked`);
    animateColor(color);  
    playSound(color);  
    console.log("color:",color);    
    setUserClickedPattern(prevPattern => [...prevPattern, color]);
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
    }, 2000);
  };

  const checkAnswer = (lastIndex) => {
    console.log("gamePattern[lastIndex]",gamePattern[lastIndex]);
    console.log("userClickedPattern[lastIndex]",userClickedPattern[lastIndex]);

    if (gamePattern[lastIndex] !== userClickedPattern[lastIndex]) {
      
      startOver();
    } else if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  };  


  const animateColor = (color) => {
    console.log("animateColor")
    setActiveColor(color);
    setTimeout(() => {
      setActiveColor("");
    }, 300); // CSS 애니메이션 시간과 일치
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
  </div>
  );
}

export default App;
