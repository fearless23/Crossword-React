import { useState, useReducer } from 'react';
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

const emptyRow = { answer: '', clue: '' };
const minWords = 5;
const initWords = () => {
  const xx = [];
  for (let i = 0; i < minWords; i++) xx.push(emptyRow);
  return xx;
};

const ACTIONS = {
  CLUE_CHANGED: 'CLUE_CHANGED',
  WORD_CHANGED: 'WORD_CHANGED',
  DELETE_ROW: 'DELETE_ROW',
  ADD_ROW: 'ADD_ROW',
  RESET: 'RESET',
};

const wordsReducer = (state, [action, payload]) => {
  const prev = [...state];
  switch (action) {
    case ACTIONS.CLUE_CHANGED: {
      const idx = payload.idx;
      prev[idx] = { answer: state[idx].answer, clue: payload.clue };
      return prev;
    }
    case ACTIONS.WORD_CHANGED: {
      const idx = payload.idx;
      prev[idx] = { answer: payload.answer, clue: state[idx].clue };
      return prev;
    }
    case ACTIONS.DELETE_ROW: {
      prev.splice(payload.idx, 1);
      return prev;
    }
    case ACTIONS.ADD_ROW: {
      prev.push(emptyRow);
      return prev;
    }
    case ACTIONS.RESET: {
      return initWords();
    }
    default:
      throw new Error();
  }
};

const useLocalState = () => {
  const [words, wordDispatch] = useReducer(wordsReducer, null, initWords);
  const [error, setError] = useState({ idx: null, at: null });

  const answerChanged = (answer, idx) => {
    wordDispatch([ACTIONS.WORD_CHANGED, { idx, answer }]);
  };

  const clueChanged = (clue, idx) => {
    wordDispatch([ACTIONS.CLUE_CHANGED, { idx, clue }]);
  };

  const deleteRow = (idx) => {
    wordDispatch([ACTIONS.DELETE_ROW, { idx }]);
  };

  const addRow = () => {
    const xx = foundEmptyText(words);
    if (xx) {
      setError(xx);
      return;
    }
    wordDispatch([ACTIONS.ADD_ROW, {}]);
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

export { useLocalState };
