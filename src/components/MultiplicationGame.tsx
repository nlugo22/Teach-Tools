import React, { useEffect, useState } from 'react'

const MultiplicationGame = () => {
  const [numsToMultiply, setNumsToMultiply] = useState<[number, number]>([0, 0]);
  const [multiplicationAnswer, setMultiplicationAnswer] = useState<number>(); 
  const [multResponse, setMultResponse] = useState<number>(0);
  const [correct, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    const num1 = numsToMultiply[0];
    const num2 = numsToMultiply[1];
    const answer = num1 * num2;
    setMultiplicationAnswer(answer);
  },[numsToMultiply])

  const twoRandomNums = () => {
    const min = 1;
    const max = 10;

    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;

    setIsCorrect(false); // reset
    setNumsToMultiply([num1, num2]);
    setMultResponse(0);
  };

  const checkAnswer = () => { 
    if (multiplicationAnswer !== undefined && multResponse === multiplicationAnswer) {
      setIsCorrect(true)
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div>
      <button onClick={twoRandomNums}>Multiply!</button>
      <p>{numsToMultiply[0]} x {numsToMultiply[1]}</p>

      <input 
        type="number" 
        value={multResponse}
        onChange={(e) => setMultResponse(Number(e.target.value))} 
        placeholder='Enter your answer!'
      />

      <button onClick={checkAnswer}>Submit</button>

      {correct != undefined && (
        <div>
          <p>{correct ? 'Correct!' : 'Incorrect, try again!'}</p>
          <p>'Your answer:' {multResponse}</p>
          <p>'Correct answer:' {multiplicationAnswer}</p>
        </div>
      )}
    </div>
  )
}

export default MultiplicationGame
