import { useState } from "react";

const ScoreCounter = () => {
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  const incrementLeftScore = () => {
    setLeftScore(leftScore + 1);
  };

  const decrementLeftScore = () => {
    setLeftScore(leftScore - 1);
  };

  const incrementRightScore = () => {
    setRightScore(rightScore + 1);
  };

  const decrementRightScore = () => {
    setRightScore(rightScore - 1);
  };

  return (
    <div className="flex flex-row grow h-full">
      <div className="flex flex-col grow items-center text-9xl font-bold max-w-[50%]">
        <button className="flex items-center z-10" onClick={incrementLeftScore}>
          +
        </button>
        <div className="flex grow items-center text-superxl leading-[0.65] mb-28">
          {leftScore}
        </div>
        <button className="flex items-center" onClick={decrementLeftScore}>
          -
        </button>
      </div>
      <div className="flex flex-col grow items-center text-9xl font-bold bg-red-600 text-white max-w-[50%]">
        <button
          className="flex items-center z-10"
          onClick={incrementRightScore}
        >
          +
        </button>
        <div className="flex grow items-center text-superxl leading-[0.65] mb-28">
          {rightScore}
        </div>
        <button
          className="flex h-1/8 items-center"
          onClick={decrementRightScore}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default ScoreCounter;
