import React, { useState } from 'react';
import WordClue from '../WordClue/WordClue';
import './Words.css';

const foundEmptyText = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const { answer, clue } = arr[i];
    if (!answer) {
      return { idx: i, at: 'answer' };
    }
    if (!clue) {
      return { idx: i, at: 'clue' };
    }
  }
  return null;
};

const useLocalState = () => {
  const emptyRow = { answer: '', clue: '' };
  const [words, setWords] = useState([emptyRow]);
  const [error, setError] = useState({ idx: null, at: null });

  const answerChanged = (answer, idx) => {
    const prev = [...words];
    prev[idx] = { answer, clue: words[idx].clue };
    setWords(prev);
  };

  const clueChanged = (clue, idx) => {
    const prev = [...words];
    prev[idx] = { answer: words[idx].answer, clue };
    setWords(prev);
  };

  const deleteRow = (idx) => {
    const prev = [...words];
    prev.splice(idx, 1);
    setWords(prev);
  };

  const addRow = () => {
    const xx = foundEmptyText(words);
    if (xx) {
      setError(xx);
      return;
    }
    const prev = [...words];
    prev.push(emptyRow);
    setWords(prev);
  };

  const checkData = () => {
    const xx = foundEmptyText(words);
    if (xx) setError(xx);
    return !xx;
  };

  return {
    words,
    answerChanged,
    clueChanged,
    addRow,
    deleteRow,
    error,
    checkData,
  };
};

const Words = (props) => {
  const {
    words,
    answerChanged,
    clueChanged,
    addRow,
    deleteRow,
    error,
    checkData,
  } = useLocalState();

  const makeData = () => {
    const xx = checkData();
    if (xx) return props.onSubmit(words);
  };

  return (
    <section className="wordsWrapper">
      <div className="wordsContainer">
        <h1>Create Puzzle</h1>
        <h3>Add Words and clues</h3>
        <div className="wordClueHead">
          <span>#</span>
          <span>Word</span>
          <span>Clue</span>
          <span>-</span>
        </div>
        {words.map((x, i) => (
          <WordClue
            key={i}
            idx={i}
            data={x}
            error={error}
            answerChanged={answerChanged}
            clueChanged={clueChanged}
            deleteRow={deleteRow}
          />
        ))}

        <button onClick={addRow} className="round">
          +
        </button>
        <button onClick={makeData} className="btn">
          Create Puzzle
        </button>
      </div>
    </section>
  );
};

export default Words;

/*
const inputJSON = [
  {
    clue:
      "that which is established as a rule or model by authority, custom, or general consent",
    answer: "standard",
  },
  { clue: "a machine that computes", answer: "computer" },
  {
    clue: "the collective designation of items for a particular purpose",
    answer: "equipment",
  },
  { clue: "an opening or entrance to an inclosed place", answer: "port" },
  {
    clue: "a point where two things can connect and interact",
    answer: "interface",
  },
];
*/
