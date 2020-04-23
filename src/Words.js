import React, { useState } from "react";

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

const Words = (props) => {
  const [text, setText] = useState("");

  const makeData = () => {
    const words = text.split("\n").map((row) => {
      const [answer, clue] = row.split(":");
      return { answer, clue };
    });
    console.log(words);
    return props.onSubmit(words);
  };

  const textAreaChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div>
      <h3>Type in following manner</h3>
      <p>
        word:clue
        <br />
        basketball: game played by tall people, famous in US
        <br />
        football: most watched sport in the world
      </p>
      <textarea
        style={{display:'block'}}
        name="wo"
        cols="30"
        rows="10"
        value={text}
        onChange={textAreaChange}
      ></textarea>
      <button onClick={makeData}>Submit Words to Create Puzzle</button>
    </div>
  );
};

export default Words;
