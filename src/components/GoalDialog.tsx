import { useState, useEffect } from "react";

const musicUrls = [
  "/scoreboard/music/Kernkraft400-ZombieNation-Sample.mp3",
  "/scoreboard/music/AlienAntFarm-SmoothCriminal-Sample.mp3",
  "/scoreboard/music/BloodhoundGang-TheBadTouch-Sample.mp3",
  "/scoreboard/music/Blur-Song2-Sample.mp3",
  "/scoreboard/music/Darude-Sandstorm-Sample.mp3",
  "/scoreboard/music/LittleBig-Skibidi-Sample.mp3",
  "/scoreboard/music/Psy-GangdamStyle-Sample.mp3",
];

const GoalDialog = () => {
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [musicUrl, setMusicUrl] = useState<string>();

  setTimeout(() => {
    setShowGoalDialog(true);
  }, 1000);

  useEffect(() => {
    const url = musicUrls[Math.floor(Math.random() * musicUrls.length)];
    console.log(url);
    setMusicUrl(url);

    setTimeout(() => {
      setShowGoalDialog(true);
    }, 1000);
  }, []);

  return (
    <>
      <div
        className={`${
          showGoalDialog ? "visible" : "hidden"
        } h-full w-full absolute z-10 bg-white font-extrabold content-center items-center`}
      >
        <h1 className="text-superxl">GOAL!</h1>
      </div>
      {musicUrl && (
        <audio id="musicplayer" autoPlay>
          <source src={musicUrl} />
        </audio>
      )}
    </>
  );
};

export default GoalDialog;
