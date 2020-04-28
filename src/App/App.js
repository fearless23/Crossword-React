import React, { useState } from 'react';
import Puzzle from './cmps/Puzzle/Puzzle';
import Words from './cmps/Words/Words';

const App = () => {
  const [start, setStart] = useState(false);
  const [words, setWords] = useState([]);
  const getWords = (myWords) => {
    localStorage.clear();
    setWords(myWords);
    setStart(true);
  };

  const newGame = () => {
    localStorage.clear();
    setStart(false);
  };

  return (
    <>
      {!start ? (
        <Words onSubmit={(myWords) => getWords(myWords)} />
      ) : (
        <Puzzle data={words} newGame={newGame} />
      )}
    </>
  );
};

export default App;
