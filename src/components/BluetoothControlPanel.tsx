import {
  Settings2,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  BluetoothSearching,
} from "lucide-react";
import { useState, useCallback, useMemo, useEffect, useContext } from "react";
import useWebBluetooth from "../hooks/useWebBluetooth";

import { SettingsContext } from "./SettingsProvider";

export interface BluetoothControlPanelProps {
  handleResetScores: () => void;
  handleUpdateScores: (leftScore: number, rightScore: number) => void;
  handleSwapTeams: () => void;
}

const BluetoothControlPanel = ({
  handleResetScores,
  handleUpdateScores,
  handleSwapTeams,
}: BluetoothControlPanelProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [enableSound, setEnableSound] = useState(true);
  const [enableGoalOverlay, setEnableGoalOverlay] = useState(true);
  const [overlayDuration, setOverlayDuration] = useState(5);

  const { settings, updateSettings } = useContext(SettingsContext);

  useEffect(() => {
    setEnableSound(settings.enableSound);
    setEnableGoalOverlay(settings.enableGoalOverlay);
    setOverlayDuration(settings.overlayDuration);
  }, [settings]);

  const handleUpdateSound = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateSettings({ ...settings, enableSound: event.target.checked });
    },
    [settings, updateSettings]
  );

  const handleUpdateGoalOverlay = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateSettings({ ...settings, enableGoalOverlay: event.target.checked });
    },
    [settings, updateSettings]
  );

  const handleUpdateOverlayDuration = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateSettings({
        ...settings,
        overlayDuration: event.target.valueAsNumber,
      });
    },
    [settings, updateSettings]
  );

  const handleIncomingData = useCallback(
    async (data: string) => {
      console.log(data);
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      if (parsedData?.reset === "true") {
        handleResetScores();
        return;
      }
      handleUpdateScores(parsedData?.b, parsedData?.a);
    },
    [handleUpdateScores, handleResetScores]
  );

  const {
    supportsBluetooth,
    isDisconnected,
    connectToNewDeviceAndSubscribeToUpdates,
    previouslyPairedDevices,
    clearPairedDevices,
  } = useWebBluetooth(handleIncomingData);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const BluetoothStatus = useMemo(() => {
    if (supportsBluetooth === false) {
      return <BluetoothOff size={24} className="text-red-600" />;
    } else {
      if (isDisconnected && previouslyPairedDevices.length === 0) {
        return <Bluetooth size={24} className="text-gray-400" />;
      } else if (isDisconnected) {
        return <BluetoothSearching size={24} className="text-gray-400" />;
      }
      return <BluetoothConnected className="text-green-400" size={24} />;
    }
  }, [supportsBluetooth, isDisconnected, previouslyPairedDevices]);

  return (
    <div className="top-4 left-4 fixed flex flex-col gap-2 items-center justify-center z-50">
      <div
        className={`flex flex-row grow border rounded border-solid border-gray-700 items-start bg-white`}
      >
        <button
          className={`text-gray-700 border-none p-2`}
          onClick={toggleMenu}
        >
          <Settings2 size={24} />
        </button>
        {menuOpen && (
          <div className="flex flex-col gap-y-2 m-2">
            {supportsBluetooth ? (
              <div className="flex flex-col gap-y-2">
                {isDisconnected && (
                  <button
                    className="p-2 border rounded border-solid border-gray-700"
                    onClick={connectToNewDeviceAndSubscribeToUpdates}
                  >
                    Connect to remote
                  </button>
                )}
                <button
                  className="p-2 border rounded border-solid border-red-400"
                  onClick={clearPairedDevices}
                >
                  Clear paired remotes
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-y-2">
                <p>Bluetooth is not supported on this device</p>
              </div>
            )}
            <button
              className="p-2 border rounded border-solid border-gray-700"
              onClick={handleResetScores}
            >
              Reset scores
            </button>
            <div className="flex">
              <input
                type="checkbox"
                id="sound"
                name="sound"
                checked={enableSound}
                onChange={handleUpdateSound}
              />
              <label htmlFor="sound" className="ml-2">
                Sound
              </label>
            </div>
            <div className="flex">
              <input
                type="checkbox"
                id="goal-overlay"
                name="goal-overlay"
                checked={enableGoalOverlay}
                onChange={handleUpdateGoalOverlay}
              />
              <label htmlFor="goal-overlay" className="ml-2">
                Goal overlay
              </label>
            </div>
            <button
              className="p-2 border rounded border-solid border-gray-700"
              onClick={handleSwapTeams}
            >
              Swap teams
            </button>
            <div className="flex flex-col min-w-[170px]">
              <input
                type="range"
                id="goal-overlay-duration"
                name="goal-overlay-duration"
                min="1"
                max="10"
                value={overlayDuration}
                onChange={handleUpdateOverlayDuration}
              />
              <label
                className="ml-2 inline-block"
                htmlFor="goal-overlay-duration"
              >
                Overlay Duration ({overlayDuration}s)
              </label>
            </div>
          </div>
        )}
      </div>
      <div className="fixed top-16 left-6 z-50">{BluetoothStatus}</div>
    </div>
  );
};

export default BluetoothControlPanel;
