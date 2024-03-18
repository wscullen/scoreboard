import {
  Settings2,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  BluetoothSearching,
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import useWebBluetooth from "../hooks/useWebBluetooth";

export interface BluetoothControlPanelProps {
  handleResetScores: () => void;
  handleUpdateScores: (leftScore: number, rightScore: number) => void;
}

const BluetoothControlPanel = ({
  handleResetScores,
  handleUpdateScores,
}: BluetoothControlPanelProps) => {
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
    [handleUpdateScores]
  );

  const {
    supportsBluetooth,
    isDisconnected,
    connectToNewDeviceAndSubscribeToUpdates,
    sendData,
    previouslyPairedDevices,
    clearPairedDevices,
  } = useWebBluetooth(handleIncomingData);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  console.log(previouslyPairedDevices);
  console.log(isDisconnected);

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
    <div className="top-4 left-4 fixed flex flex-col gap-2 items-center justify-center">
      <div className="p-2 flex flex-row gap-x-2 grow border rounded border-solid border-gray-700 items-start">
        <button className=" text-gray-700 border-none" onClick={toggleMenu}>
          <Settings2 size={24} />
        </button>
        {menuOpen && (
          <div className="flex flex-col gap-y-2">
            {supportsBluetooth ? (
              <div className="flex flex-col gap-y-2">
                {isDisconnected && previouslyPairedDevices.length === 0 && (
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
          </div>
        )}
      </div>
      <div className="fixed top-16 left-6">{BluetoothStatus}</div>
    </div>
  );
};

export default BluetoothControlPanel;
