import React from 'react';
import WordClue from '../WordClue/WordClue';
import { useLocalState } from './WordsStateManager';
import './Words.css';

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

        <div className="buttonGroup">
          <button onClick={addRow} className="round">
            +
          </button>
          <button onClick={makeData} className="btn">
            Create Puzzle
          </button>
        </div>
      </div>
    </section>
  );
};

export default Words;
