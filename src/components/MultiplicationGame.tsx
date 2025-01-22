import React, { useEffect, useState } from 'react'

const MultiplicationGame = () => {
  const [numsToMultiply, setNumsToMultiply] = useState<[number, number]>([0, 0]);
  const [multiplicationAnswer, setMultiplicationAnswer] = useState<number>(); 
  const [multInput, setMultInput] = useState<string>('');
  const [correct, setIsCorrect] = useState<boolean>(false);
  const [answerChecked, setAnswerChecked] = useState<boolean>(false);

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

    
    setNumsToMultiply([num1, num2]);
    // reset everything
    setIsCorrect(false);
    setMultInput('');
    setAnswerChecked(false);
  };

  const checkAnswer = () => { 
    const responseAnswer = Number(multInput);
    if (responseAnswer !== undefined && responseAnswer === multiplicationAnswer) {
      setIsCorrect(true)
    } else {
      setIsCorrect(false);
    }
    setAnswerChecked(true);
    setMultInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (multInput === '') {
        twoRandomNums();
      } else {
        checkAnswer();
      }
    }
  }

  return (
    <div>
      <button onClick={twoRandomNums} title='Press Enter To Try Again'>Multiply!</button>
      <p>{numsToMultiply[0]} x {numsToMultiply[1]}</p>

      <input 
        type="number" 
        value={multInput}
        onChange={(e) => setMultInput(e.target.value)} 
        placeholder='Enter your answer!'
        autoFocus
        onKeyDown={handleKeyDown}
        title='Press Enter To Submit'
      />

      <button onClick={checkAnswer}>Submit</button>

      {answerChecked && (correct != undefined) && (
        <div>
          <p>{correct ? 'Correct!' : 'Incorrect, try again!'}</p>
          <p>'Your answer:' {multInput}</p>
          <p>'Correct answer:' {multiplicationAnswer}</p>
        </div>
      )}
    </div>
  )
}

export default MultiplicationGame
