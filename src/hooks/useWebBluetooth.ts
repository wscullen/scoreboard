import { useState, useEffect, useCallback, useRef } from "react";

// navigator.bluetooth.requestDevice({ filters: [{ services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e'] }]  })
// .then(device => {
//   bobble= device;
//   // Attempts to connect to remote GATT Server.
//   document.getElementById("demo").innerHTML = "Bobble connected";
//   sleep(10);
//   return device.gatt.connect();
// })
// .then(server => {
//   sleep(10);
//   // Getting primary UART service
//   return server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
// })
// .then(service => {
//   bobbleService= service;
//   sleep(10);
//   // Getting rx characteristic
//   return service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
// })
// .then(rxcharacteristic => {
//   sleep(20);
//   bobbleRead= rxcharacteristic;
//   rxcharacteristic.startNotifications();
//   sleep(20); // Getting tx characteristic
//   return bobbleService.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');
// })
// .then(characteristic => {
//   sleep(100);
//   bobbleRead.addEventListener('characteristicvaluechanged', handleSensorChanged);
//   // turn off motor and reset servo
//   sleep(20);
//   bobbleWrite= characteristic;
//   let encoder = new TextEncoder();
//   return characteristic.writeValue(encoder.encode(". - 0 s\n"));
// })

const uartServiceUUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const rxCharacteristic = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
const txCharacteristic = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

const useWebBluetooth = (incomingDataEventListener: (data: string) => void) => {
  const [supportsBluetooth, setSupportsBluetooth] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(true);
  const [previouslyPairedDevices, setPreviouslyPairedDevices] = useState<
    BluetoothDevice[]
  >([]);
  const currentDevice = useRef<BluetoothDevice | null>(null);
  const currentService = useRef<BluetoothRemoteGATTService | null>(null);

  // When the component mounts, check that the browser supports Bluetooth
  useEffect(() => {
    if (navigator?.bluetooth) {
      setSupportsBluetooth(true);

      const getPairedDevices = async () => {
        const devices = await navigator.bluetooth.getDevices();
        setPreviouslyPairedDevices(devices);
      };

      getPairedDevices();
    }
  }, []);

  const clearPairedDevices = async () => {
    const devices = await navigator.bluetooth.getDevices();
    devices.forEach(async (device) => {
      await device.forget();
    });
    setPreviouslyPairedDevices([]);
    setIsDisconnected(true);
  };

  useEffect(() => {
    let reconnect: number | undefined = undefined;
    if (previouslyPairedDevices.length > 0) {
      reconnect = setInterval(() => {
        console.log(isDisconnected);
        if (!isDisconnected) {
          clearInterval(reconnect);
          return;
        }
        const device = previouslyPairedDevices[0];
        connectToExistingDevice(device);
      }, 5000);
    } else {
      if (reconnect !== undefined) clearInterval(reconnect);
    }

    return () => {
      if (reconnect !== undefined) clearInterval(reconnect);
    };
  }, [previouslyPairedDevices, isDisconnected]);

  //   const connectToBluetoothDevice = useCallback((device: BluetoothDevice) => {
  //     const abortController = new AbortController();

  //     const handleAdvertisement = async (event: Event) => {
  //       console.log('> Received advertisement from "' + device.name + '"...');
  //       console.log(event);
  //       // Stop watching advertisements to conserve battery life.
  //       abortController.abort();
  //       console.log('Connecting to GATT Server from "' + device.name + '"...');
  //       try {
  //         await device?.gatt?.connect();
  //         console.log('> Bluetooth device "' + device.name + " connected.");
  //       } catch (error) {
  //         console.log("Argh! " + error);
  //       }
  //     };

  //     device.addEventListener("advertisementreceived", handleAdvertisement);

  //     try {
  //       console.log('Watching advertisements from "' + device.name + '"...');
  //       await device.watchAdvertisements({ signal: abortController.signal });
  //     } catch (error) {
  //       console.log("Argh! " + error);
  //     }
  //   }

  /**
   * Let the user know when their device has been disconnected.
   */
  const onDisconnected = useCallback(() => {
    console.log("disconnected event recieved");
    // alert(`The device ${event.target} is disconnected`);
    setIsDisconnected(true);
    currentDevice.current = null;
    currentService.current = null;
  }, []);

  //   const getDevices = async () => {
  //     const devices = await navigator.bluetooth.getDevices();
  //     console.log(devices);
  //     if (devices.length > 0) {
  //       connectToBluetoothDevice(devices[0]);
  //     }
  //   };

  // const watchAdvertisements = async () => {
  //   const devices = await navigator.bluetooth.watchAdvertisements();
  //   console.log(devices);
  // };
  /**
   * Update the value shown on the web page when a notification is
   * received.
   */
  const handleCharacteristicValueChanged = (event: Event) => {
    console.log(event);
    const { value } = event?.target as BluetoothRemoteGATTCharacteristic;
    incomingDataEventListener(new TextDecoder().decode(value));
  };

  const sendData = async (data: string) => {
    try {
      const characteristic = await currentService.current?.getCharacteristic(
        txCharacteristic
      );
      const encoder = new TextEncoder();
      await characteristic?.writeValue(encoder.encode(data));
    } catch (error) {
      console.log(`There was an error sending data: ${error}`);
    }
  };

  const connectToExistingDevice = async (device: BluetoothDevice) => {
    try {
      console.log("trying to connect to existing device", device);

      // Need to do this to prevent Chrome "forgetting" the device and throwing
      // device out of range error
      await device?.watchAdvertisements();

      currentDevice.current = device;

      // Add an event listener to detect when a device disconnects
      device.addEventListener("gattserverdisconnected", onDisconnected);

      // Try to connect to the remote GATT Server running on the Bluetooth device
      const server = await device?.gatt?.connect();

      // Get the battery service from the Bluetooth device
      const uartService = await server?.getPrimaryService(uartServiceUUID);
      const characteristic = await uartService?.getCharacteristic(
        rxCharacteristic
      );

      characteristic?.startNotifications();

      // When the battery level changes, call a function
      characteristic?.addEventListener(
        "characteristicvaluechanged",
        handleCharacteristicValueChanged
      );
      setIsDisconnected(false);
    } catch (error: unknown) {
      console.log(`There was an error: ${error}`);
    }
  };
  /**
   * Attempts to connect to a Bluetooth device and subscribe to
   * battery level readings using the battery service.
   */
  const connectToNewDeviceAndSubscribeToUpdates = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [uartServiceUUID] }],
      });

      await connectToExistingDevice(device);
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  };

  return {
    supportsBluetooth,
    connectToNewDeviceAndSubscribeToUpdates,
    sendData,
    isDisconnected,
    previouslyPairedDevices,
    clearPairedDevices,
  };
};

export default useWebBluetooth;
