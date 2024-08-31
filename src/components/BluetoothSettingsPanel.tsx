import {
  Bluetooth,
  BluetoothConnected,
  BluetoothSearching,
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import useWebBluetooth from "../hooks/useWebBluetooth";

export interface BluetoothSettingsPanelProps {
  handleResetScores: () => void;
  handleUpdateScores: (leftScore: number, rightScore: number) => void;
}

const BluetoothSettingsPanel = ({
  handleResetScores,
  handleUpdateScores,
}: BluetoothSettingsPanelProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

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
    if (isDisconnected && previouslyPairedDevices.length === 0) {
      return <Bluetooth size={24} className="text-gray-400" />;
    } else if (isDisconnected) {
      return <BluetoothSearching size={24} className="text-gray-400" />;
    }
    return <BluetoothConnected className="text-green-400" size={24} />;
  }, [isDisconnected, previouslyPairedDevices]);

  return (
    <div
      className={`top-4 left-4 flex flex-col gap-2 items-center justify-center z-50 ${
        !supportsBluetooth && "hidden"
      }`}
    >
      <div
        className={`flex flex-row grow border rounded border-solid border-gray-700 items-start bg-white`}
      >
        <button
          className={`text-gray-700 border-none p-2`}
          onClick={toggleMenu}
        >
          {BluetoothStatus}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default BluetoothSettingsPanel;
