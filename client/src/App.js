import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const cardImages = [
  { src: "C:\Users\Anusha\OneDrive\Desktop\img1.png", matched: false },
  { src: "C:\Users\Anusha\OneDrive\Desktop\img2.png", matched: false },
  { src: "C:\Users\Anusha\OneDrive\Desktop\img3.png", matched: false },
  { src: "C:\Users\Anusha\OneDrive\Desktop\img4.png", matched: false },
  { src: "C:\Users\Anusha\OneDrive\Desktop\img5.png", matched: false },
  { src: "C:\Users\Anusha\OneDrive\Desktop\img6.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("");
  const [highScores, setHighScores] = useState([]);

  // Shuffle and generate cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setScore(0);
  };

  // Handle choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // Compare cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) =>
          prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            }
            return card;
          })
        );
        setScore((prevScore) => prevScore + 10);
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  // Save high score
  const saveScore = async () => {
    if (username && score > 0) {
      await axios.post("http://localhost:5000/api/scores", {
        username,
        score,
      });
      getHighScores();
    }
  };

  // Get high scores
  const getHighScores = async () => {
    const response = await axios.get("http://localhost:5000/api/scores");
    setHighScores(response.data);
  };

  // Start a new game
  useEffect(() => {
    shuffleCards();
    getHighScores();
  }, []);

  return (
    <div className="App">
      <h1>Memory Card Game</h1>
      <div className="score">
        <h3>Score: {score}</h3>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={saveScore}>Save Score</button>
      </div>
      <div className="card-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className={card.matched ? "matched" : ""}
            onClick={() => !disabled && handleChoice(card)}
          >
            <img
              src={choiceOne === card || choiceTwo === card || card.matched ? card.src : "C:\Users\Anusha\OneDrive\Desktop\cover.png"}
              alt="card"
            />
          </div>
        ))}
      </div>
      <div>
        <h2>High Scores</h2>
        <ul>
          {highScores.map((user, index) => (
            <li key={index}>
              {user.username}: {user.score}
            </li>
          ))}
      </ul>
    </div>
  </div>
)};