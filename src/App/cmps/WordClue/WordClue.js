import React from 'react';
import './WordClue.css';

const WordClue = (props) => {
  const { data, idx, error } = props;

  const isError = error.idx === idx;
  const isErrorAtAnswer = isError && error.at === 'answer';
  const isErrorAtClue = isError && error.at === 'clue';

  const answerChanged = (e) => {
    props.answerChanged(e.target.value, idx);
  };

  const clueChanged = (e) => {
    props.clueChanged(e.target.value, idx);
  };

  return (
    <div className="wordClueRow">
      <span className="idx">{idx + 1}</span>
      <input
        className={isErrorAtAnswer ? 'error' : ''}
        name="answer"
        value={data.answer}
        placeholder="Type Word"
        onChange={answerChanged}
      ></input>
      <input
        name="clue"
        className={isErrorAtClue ? 'error' : ''}
        value={data.clue}
        placeholder="Type Clue"
        onChange={clueChanged}
      ></input>
      <button onClick={() => props.deleteRow(idx)}>X</button>
    </div>
  );
};

export default WordClue;
