import React, { useState } from "react";
import Puzzle from "./Puzzle";
import Words from "./Words";
import "./App.css";

const App = () => {
  const [start, setStart] = useState(false);
  const [words, setWords] = useState([]);
  const getWords = (myWords) => {
    localStorage.clear();
    setWords(myWords);
    setStart(true);
  };

  return (
    <div>
      {!start ? (
        <Words onSubmit={(myWords) => getWords(myWords)} />
      ) : (
        <Puzzle data={words} />
      )}
    </div>
  );
};

export default App;
