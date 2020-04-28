import React from 'react';
import Crossword from '@jaredreisinger/react-crossword';
import { createPuzzleData } from './algo';

export default (props) => {
  const data = createPuzzleData(props.data);
  console.log('DATA', props.data);
  console.log('FINAL', data);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button onClick={() => localStorage.clear()}>Reset Game</button>
      <button onClick={props.newGame}>New Game</button>
      <div style={{ width: '70%', padding: '2em' }}>
        <Crossword
          data={data}
          columnBreakpoint="768px"
          gridBackground="transparent"
          cellBackground="#fff"
          cellBorder="#fca"
          textColor="#2a98ef"
          numberColor="hotpink"
          focusBackground="#f00"
          highlightBackground="#f99"
          onCorrect={(a, b, c) => {
            console.log(a, b, c);
          }}
        />
      </div>
    </div>
  );
};
