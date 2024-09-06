import { useCallback, useState, useContext } from "react";

import SettingsPanel from "./SettingsPanel";
import BluetoothSettingsPanel from "./BluetoothSettingsPanel";
import GoalDialog from "./GoalDialog/GoalDialog";
import { useKeyDown } from "../hooks/useKeyDown";
import { Team } from "../utils/enums";

import { SettingsContext } from "./SettingsProvider";

export interface TeamColor {
  bg: string;
  text: string;
}

const ScoreCounter = () => {
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  const [leftTeamColor, setLeftTeamColor] = useState<TeamColor>({
    bg: "bg-red-600",
    text: "text-white",
  });
  const [rightTeamColor, setRightTeamColor] = useState<TeamColor>({
    bg: "bg-white",
    text: "text-black",
  });

  const [goalDialogOpen, setGoalDialogOpen] = useState<Team | undefined>();

  const { settings, updateSettings } = useContext(SettingsContext);

  const updateScores = useCallback((leftScore: number, rightScore: number) => {
    setLeftScore(leftScore);
    setRightScore(rightScore);
  }, []);

  const swapTeams = useCallback(() => {
    setLeftScore(rightScore);
    setRightScore(leftScore);
    setLeftTeamColor({
      bg: rightTeamColor.bg,
      text: rightTeamColor.text,
    });
    setRightTeamColor({
      bg: leftTeamColor.bg,
      text: leftTeamColor.text,
    });
  }, [leftScore, rightScore, leftTeamColor, rightTeamColor]);

  const toggleSound = useCallback(() => {
    updateSettings({ ...settings, enableSound: !settings.enableSound });
  }, [settings, updateSettings]);

  const toggleGoalDialog = useCallback(() => {
    updateSettings({
      ...settings,
      enableGoalOverlay: !settings.enableGoalOverlay,
    });
  }, [settings, updateSettings]);

  const incrementLeftScore = useCallback(() => {
    setLeftScore(leftScore + 1);
    if (settings.enableGoalOverlay) {
      setGoalDialogOpen(Team.Left);
      setTimeout(() => {
        setGoalDialogOpen(undefined);
      }, settings.overlayDuration * 1000);
    }
  }, [leftScore, settings.enableGoalOverlay, settings.overlayDuration]);

  const decrementLeftScore = useCallback(() => {
    if (leftScore === 0) return;
    setLeftScore(leftScore - 1);
  }, [leftScore]);

  const incrementRightScore = useCallback(() => {
    setRightScore(rightScore + 1);
    if (settings.enableGoalOverlay) {
      setGoalDialogOpen(Team.Right);
      setTimeout(() => {
        setGoalDialogOpen(undefined);
      }, settings.overlayDuration * 1000);
    }
  }, [rightScore, settings.enableGoalOverlay, settings.overlayDuration]);

  const decrementRightScore = useCallback(() => {
    if (rightScore === 0) return;
    setRightScore(rightScore - 1);
  }, [rightScore]);

  const resetScores = useCallback(() => {
    setLeftScore(0);
    setRightScore(0);
  }, []);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (goalDialogOpen) return;

      console.log(e);

      if (e.key === "z") {
        decrementLeftScore();
      } else if (e.key === "x") {
        incrementLeftScore();
      } else if (e.key === ",") {
        decrementRightScore();
      } else if (e.key === ".") {
        incrementRightScore();
      } else if (e.altKey && e.key === "r") {
        resetScores();
      } else if (e.altKey && e.key === "w") {
        swapTeams();
      } else if (e.altKey && e.key === "s") {
        toggleSound();
      } else if (e.altKey && e.key === "g") {
        toggleGoalDialog();
      }
    },
    [
      decrementLeftScore,
      incrementLeftScore,
      decrementRightScore,
      incrementRightScore,
      goalDialogOpen,
      resetScores,
      toggleSound,
      swapTeams,
      toggleGoalDialog,
    ]
  );

  useKeyDown(handleKeyPress, [
    "z",
    "x",
    ",",
    ".",
    "1",
    "2",
    "w",
    "s",
    "g",
    "-",
    "+",
    "r",
  ]);

  return (
    <div className="sm/main:flex-row flex flex-col grow h-full v-full">
      <div className="fixed top-2 left-2 flex flex-col gap-2 z-50 items-start">
        <SettingsPanel
          handleResetScores={resetScores}
          handleUpdateScores={updateScores}
          handleSwapTeams={swapTeams}
        />
        <BluetoothSettingsPanel
          handleResetScores={resetScores}
          handleUpdateScores={updateScores}
        />
      </div>
      {goalDialogOpen && (
        <GoalDialog
          teamColor={
            goalDialogOpen === Team.Left ? leftTeamColor : rightTeamColor
          }
          duration={settings.overlayDuration}
        />
      )}
      <div
        className={`text-3xl flex flex-col grow items-center font-bold ${leftTeamColor.bg} ${leftTeamColor.text}`}
      >
        <button className="flex items-center z-10" onClick={incrementLeftScore}>
          +
        </button>
        <div className="text-13xl md:text-supersm 2xl:text-supermd flex grow items-center leading-[0.65]">
          {leftScore}
        </div>
        <button className="flex items-center" onClick={decrementLeftScore}>
          -
        </button>
      </div>
      <div
        className={`text-3xl flex flex-col grow items-center font-bold ${rightTeamColor.bg} ${rightTeamColor.text}`}
      >
        <button
          className="flex items-center z-10"
          onClick={incrementRightScore}
        >
          +
        </button>
        <div className="text-13xl md:text-supersm 2xl:text-supermd flex grow items-center leading-[0.65]">
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
