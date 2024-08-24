import { useState, useEffect } from "react";

import "./GoalDialog.css";
import { TeamColor } from "../Scoreboard";

const musicUrls = [
  "/scoreboard/music/Kernkraft400-ZombieNation-Sample.mp3",
  "/scoreboard/music/AlienAntFarm-SmoothCriminal-Sample.mp3",
  "/scoreboard/music/BloodhoundGang-TheBadTouch-Sample.mp3",
  "/scoreboard/music/Blur-Song2-Sample.mp3",
  "/scoreboard/music/Darude-Sandstorm-Sample.mp3",
  "/scoreboard/music/LittleBig-Skibidi-Sample.mp3",
  "/scoreboard/music/Psy-GangdamStyle-Sample.mp3",
  "/scoreboard/music/edmonton_oilers.mp3",
  "/scoreboard/music/calgary_flames.mp3",
  "/scoreboard/music/detroit_red_wings.mp3",
  "/scoreboard/music/tampa_bay_lightning.mp3",
];

interface Props {
  teamColor: TeamColor;
}

const GoalDialog = ({ teamColor }: Props) => {
  const [musicUrl, setMusicUrl] = useState<string>();

  useEffect(() => {
    let abort = false;
    const lastSampleIndex = localStorage.getItem("lastSampleIndex");
    const enableMusic = localStorage.getItem("enableSound") === "true";
    let sampleIndex = Math.floor(Math.random() * musicUrls.length);
    console.log(lastSampleIndex);
    console.log(sampleIndex);
    if (lastSampleIndex) {
      while (sampleIndex === Number(lastSampleIndex)) {
        sampleIndex = Math.floor(Math.random() * musicUrls.length);
      }
    }
    const url = musicUrls[sampleIndex];

    if (enableMusic) setMusicUrl(url);

    setTimeout(() => {
      if (!abort) {
        localStorage.setItem("lastSampleIndex", String(sampleIndex));
      }
    }, 100);

    return () => {
      abort = true;
    };
  }, []);

  return (
    <>
      <div
        className={`absolute h-full w-full z-10 font-extrabold content-center items-center ${teamColor.bg} flex justify-around z-50`}
      >
        <div
          className={`xl:text-[20rem] md:text-[15rem] 2xl:text-supermd text-8xl ${teamColor.text} goal width-fit-content`}
        >
          <span>G</span>
          <span>O</span>
          <span>A</span>
          <span>L</span>
          <span>!</span>
        </div>
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
