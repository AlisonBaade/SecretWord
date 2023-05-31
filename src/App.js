import './App.css';

import { useCallback, useEffect, useState} from 'react';

import {wordList} from "./data/words";

import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';


const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

const guessesQty = 3;

function App() {

  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);
  
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickedWordAndCategory = useCallback(() => {
    // escolhe categoria aleatória
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

    // escolhe palavra aleatória da categoria selecionada
    const word = words[category][Math.floor(Math.random() * words[category].length)];
    return {word, category};
  }, [words]);

  // starta o jogo
  const startGame = useCallback(() => {
    clearLetterStates()

    // escolhendo a palavra e a categoria
    const { word, category } = pickedWordAndCategory();

    // criando um array com a palavra
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());


    // setando os estados
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickedWordAndCategory]);

  // finaliza o jogo
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()

    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)){
      return;
    }

    if(letters.includes(normalizedLetter)){
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  useEffect(() => {
    if(guesses <= 0){
      clearLetterStates()
      setGameStage(stages[2].name);
    }
  }, [guesses]);


  // checa condição de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    if(guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name){
      setScore((actualScore) => actualScore += 100)

      startGame();
    }
  }, [guessedLetters, letters, startGame, gameStage]);

  // restart do jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name)
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && 
      <Game 
        verifyLetter={verifyLetter}
        pickedWord={pickedWord}
        pickedCategory={pickedCategory}
        letters={letters}
        guessedLetters={guessedLetters}
        wrongLetters={wrongLetters}
        guesses={guesses}
        score={score}
      />
      }
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
