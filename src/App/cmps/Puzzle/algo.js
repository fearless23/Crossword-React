// Author: Michael Wehar
// Additional credits: Itay Livni, Michael Blättler
// MIT License

// Math functions
const distance = function (x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

const weightedAverage = function (weights, values) {
  let temp = 0;
  for (let k = 0; k < weights.length; k++) {
    temp += weights[k] * values[k];
  }

  if (temp < 0 || temp > 1) {
    // console.log("Error: " + values);
  }

  return temp;
};

// Component scores
// 1. Number of connections
const computeScore1 = function (connections, word) {
  return connections / (word.length / 2);
};

// 2. Distance from center
const computeScore2 = function (rows, cols, i, j) {
  return 1 - distance(rows / 2, cols / 2, i, j) / (rows / 2 + cols / 2);
};

// 3. Vertical versus horizontal orientation
const computeScore3 = function (a, b, verticalCount, totalCount) {
  if (verticalCount > totalCount / 2) {
    return a;
  } else if (verticalCount < totalCount / 2) {
    return b;
  } else {
    return 0.5;
  }
};

// 4. Word length
const computeScore4 = function (val, word) {
  return word.length / val;
};

// Word functions
const addWord = function (best, words, table) {
  // let bestScore = best[0];
  let word = best[1];
  let index = best[2];
  let bestI = best[3];
  let bestJ = best[4];
  let bestO = best[5];

  words[index].startx = bestJ + 1;
  words[index].starty = bestI + 1;

  if (bestO === 0) {
    for (let k = 0; k < word.length; k++) {
      table[bestI][bestJ + k] = word.charAt(k);
    }
    words[index].orientation = 'across';
  } else {
    for (let k = 0; k < word.length; k++) {
      table[bestI + k][bestJ] = word.charAt(k);
    }
    words[index].orientation = 'down';
  }
  // console.log(word + ", " + bestScore);
};

const assignPositions = function (words) {
  let positions = {};
  for (let index in words) {
    let word = words[index];
    if (word.orientation !== 'none') {
      let tempStr = word.starty + ',' + word.startx;
      if (tempStr in positions) {
        word.position = positions[tempStr];
      } else {
        // Object.keys is supported in ES5-compatible environments
        positions[tempStr] = Object.keys(positions).length + 1;
        word.position = positions[tempStr];
      }
    }
  }
};

const computeDimension = function (words, factor) {
  let temp = 0;
  for (let i = 0; i < words.length; i++) {
    if (temp < words[i].answer.length) {
      temp = words[i].answer.length;
    }
  }

  return temp * factor;
};

// Table functions
const initTable = function (rows, cols) {
  let table = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (j === 0) {
        table[i] = ['-'];
      } else {
        table[i][j] = '-';
      }
    }
  }

  return table;
};

const isConflict = function (table, isVertical, character, i, j) {
  if (character !== table[i][j] && table[i][j] !== '-') {
    return true;
  } else if (
    table[i][j] === '-' &&
    !isVertical &&
    i + 1 in table &&
    table[i + 1][j] !== '-'
  ) {
    return true;
  } else if (
    table[i][j] === '-' &&
    !isVertical &&
    i - 1 in table &&
    table[i - 1][j] !== '-'
  ) {
    return true;
  } else if (
    table[i][j] === '-' &&
    isVertical &&
    j + 1 in table[i] &&
    table[i][j + 1] !== '-'
  ) {
    return true;
  } else if (
    table[i][j] === '-' &&
    isVertical &&
    j - 1 in table[i] &&
    table[i][j - 1] !== '-'
  ) {
    return true;
  } else {
    return false;
  }
};

const attemptToInsert = function (
  rows,
  cols,
  table,
  weights,
  verticalCount,
  totalCount,
  word,
  index
) {
  let bestI = 0;
  let bestJ = 0;
  let bestO = 0;
  let bestScore = -1;

  // Horizontal
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols - word.length + 1; j++) {
      let isValid = true;
      let atleastOne = false;
      let connections = 0;
      let prevFlag = false;

      for (let k = 0; k < word.length; k++) {
        if (isConflict(table, false, word.charAt(k), i, j + k)) {
          isValid = false;
          break;
        } else if (table[i][j + k] === '-') {
          prevFlag = false;
          atleastOne = true;
        } else {
          if (prevFlag) {
            isValid = false;
            break;
          } else {
            prevFlag = true;
            connections += 1;
          }
        }
      }

      if (j - 1 in table[i] && table[i][j - 1] !== '-') {
        isValid = false;
      } else if (
        j + word.length in table[i] &&
        table[i][j + word.length] !== '-'
      ) {
        isValid = false;
      }

      if (isValid && atleastOne && word.length > 1) {
        let tempScore1 = computeScore1(connections, word);
        let tempScore2 = computeScore2(
          rows,
          cols,
          i,
          j + word.length / 2,
          word
        );
        let tempScore3 = computeScore3(1, 0, verticalCount, totalCount);
        let tempScore4 = computeScore4(rows, word);
        let tempScore = weightedAverage(weights, [
          tempScore1,
          tempScore2,
          tempScore3,
          tempScore4,
        ]);

        if (tempScore > bestScore) {
          bestScore = tempScore;
          bestI = i;
          bestJ = j;
          bestO = 0;
        }
      }
    }
  }

  // Vertical
  for (let i = 0; i < rows - word.length + 1; i++) {
    for (let j = 0; j < cols; j++) {
      let isValid = true;
      let atleastOne = false;
      let connections = 0;
      let prevFlag = false;

      for (let k = 0; k < word.length; k++) {
        if (isConflict(table, true, word.charAt(k), i + k, j)) {
          isValid = false;
          break;
        } else if (table[i + k][j] === '-') {
          prevFlag = false;
          atleastOne = true;
        } else {
          if (prevFlag) {
            isValid = false;
            break;
          } else {
            prevFlag = true;
            connections += 1;
          }
        }
      }

      if (i - 1 in table && table[i - 1][j] !== '-') {
        isValid = false;
      } else if (
        i + word.length in table &&
        table[i + word.length][j] !== '-'
      ) {
        isValid = false;
      }

      if (isValid && atleastOne && word.length > 1) {
        let tempScore1 = computeScore1(connections, word);
        let tempScore2 = computeScore2(
          rows,
          cols,
          i + word.length / 2,
          j,
          word
        );
        let tempScore3 = computeScore3(0, 1, verticalCount, totalCount);
        let tempScore4 = computeScore4(rows, word);
        let tempScore = weightedAverage(weights, [
          tempScore1,
          tempScore2,
          tempScore3,
          tempScore4,
        ]);

        if (tempScore > bestScore) {
          bestScore = tempScore;
          bestI = i;
          bestJ = j;
          bestO = 1;
        }
      }
    }
  }

  if (bestScore > -1) {
    return [bestScore, word, index, bestI, bestJ, bestO];
  } else {
    return [-1];
  }
};

const generateTable = function (table, rows, cols, words, weights) {
  let verticalCount = 0;
  let totalCount = 0;
  const xx = Object.values(words);
  for (let i = 0; i < xx.length; i++) {
    let best = [-1];
    for (let innerIndex in words) {
      if ('answer' in words[innerIndex] && !('startx' in words[innerIndex])) {
        let temp = attemptToInsert(
          rows,
          cols,
          table,
          weights,
          verticalCount,
          totalCount,
          words[innerIndex].answer,
          innerIndex
        );
        if (temp[0] > best[0]) {
          best = temp;
        }
      }
    }

    if (best[0] === -1) {
      break;
    } else {
      addWord(best, words, table);
      if (best[5] === 1) {
        verticalCount += 1;
      }
      totalCount += 1;
    }
  }

  for (let index in words) {
    if (!('startx' in words[index])) {
      words[index].orientation = 'none';
    }
  }

  return { table: table, result: words };
};

const removeIsolatedWords = function (data) {
  let oldTable = data.table;
  let words = data.result;
  let rows = oldTable.length;
  let cols = oldTable[0].length;
  let newTable = initTable(rows, cols);

  // Draw intersections as "X"'s
  for (let wordIndex in words) {
    let word = words[wordIndex];
    if (word.orientation === 'across') {
      let i = word.starty - 1;
      let j = word.startx - 1;
      for (let k = 0; k < word.answer.length; k++) {
        if (newTable[i][j + k] === '-') {
          newTable[i][j + k] = 'O';
        } else if (newTable[i][j + k] === 'O') {
          newTable[i][j + k] = 'X';
        }
      }
    } else if (word.orientation === 'down') {
      let i = word.starty - 1;
      let j = word.startx - 1;
      for (let k = 0; k < word.answer.length; k++) {
        if (newTable[i + k][j] === '-') {
          newTable[i + k][j] = 'O';
        } else if (newTable[i + k][j] === 'O') {
          newTable[i + k][j] = 'X';
        }
      }
    }
  }

  // Set orientations to "none" if they have no intersections
  for (let wordIndex in words) {
    let word = words[wordIndex];
    let isIsolated = true;
    if (word.orientation === 'across') {
      let i = word.starty - 1;
      let j = word.startx - 1;
      for (let k = 0; k < word.answer.length; k++) {
        if (newTable[i][j + k] === 'X') {
          isIsolated = false;
          break;
        }
      }
    } else if (word.orientation === 'down') {
      let i = word.starty - 1;
      let j = word.startx - 1;
      for (let k = 0; k < word.answer.length; k++) {
        if (newTable[i + k][j] === 'X') {
          isIsolated = false;
          break;
        }
      }
    }
    if (word.orientation !== 'none' && isIsolated) {
      delete words[wordIndex].startx;
      delete words[wordIndex].starty;
      delete words[wordIndex].position;
      words[wordIndex].orientation = 'none';
    }
  }

  // Draw new table
  newTable = initTable(rows, cols);
  for (let wordIndex in words) {
    let word = words[wordIndex];
    if (word.orientation === 'across') {
      let i = word.starty - 1;
      let j = word.startx - 1;
      for (let k = 0; k < word.answer.length; k++) {
        newTable[i][j + k] = word.answer.charAt(k);
      }
    } else if (word.orientation === 'down') {
      let i = word.starty - 1;
      let j = word.startx - 1;
      for (let k = 0; k < word.answer.length; k++) {
        newTable[i + k][j] = word.answer.charAt(k);
      }
    }
  }

  return { table: newTable, result: words };
};

const trimTable = function (data) {
  let table = data.table;
  let rows = table.length;
  let cols = table[0].length;

  let leftMost = cols;
  let topMost = rows;
  let rightMost = -1;
  let bottomMost = -1;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (table[i][j] !== '-') {
        let x = j;
        let y = i;

        if (x < leftMost) {
          leftMost = x;
        }
        if (x > rightMost) {
          rightMost = x;
        }
        if (y < topMost) {
          topMost = y;
        }
        if (y > bottomMost) {
          bottomMost = y;
        }
      }
    }
  }

  let trimmedTable = initTable(
    bottomMost - topMost + 1,
    rightMost - leftMost + 1
  );
  for (let i = topMost; i < bottomMost + 1; i++) {
    for (let j = leftMost; j < rightMost + 1; j++) {
      trimmedTable[i - topMost][j - leftMost] = table[i][j];
    }
  }

  let words = data.result;
  for (let entry in words) {
    if ('startx' in words[entry]) {
      words[entry].startx -= leftMost;
      words[entry].starty -= topMost;
    }
  }

  return {
    table: trimmedTable,
    result: words,
    rows: Math.max(bottomMost - topMost + 1, 0),
    cols: Math.max(rightMost - leftMost + 1, 0),
  };
};

const generateSimpleTable = function (words) {
  let rows = computeDimension(words, 3);
  let cols = rows;
  let blankTable = initTable(rows, cols);
  let table = generateTable(blankTable, rows, cols, words, [
    0.7,
    0.15,
    0.1,
    0.05,
  ]);
  let newTable = removeIsolatedWords(table);
  let finalTable = trimTable(newTable);
  assignPositions(finalTable.result);
  return finalTable;
};

const generateLayout = function (words_json) {
  let layout = generateSimpleTable(words_json);
  // layout.table_string = tableToString(layout.table, "<br>");
  return layout;
};

const createPuzzleData = (inputJSON) => {
  const { result } = generateLayout(inputJSON);
  const data = { across: {}, down: {} };
  result.forEach((r) => {
    const { answer, clue, orientation, position, startx, starty } = r;
    data[orientation][position] = {
      clue,
      answer,
      row: starty - 1,
      col: startx - 1,
    };
  });
  return data;
};

export { createPuzzleData };
