import { useState, useEffect } from "react";

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
const RX_characteristic = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
// const TX_characteristic = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
function BluetoothTesting() {
  const [supportsBluetooth, setSupportsBluetooth] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState<string | null>(null);

  // When the component mounts, check that the browser supports Bluetooth
  useEffect(() => {
    if (navigator?.bluetooth) {
      setSupportsBluetooth(true);
    }
  }, []);

  /**
   * Let the user know when their device has been disconnected.
   */
  const onDisconnected = (event: Event) => {
    if (!isDisconnected) {
      alert(`The device ${event.target} is disconnected`);
      setIsDisconnected(true);
    }
  };

  const getDevices = async () => {
    const devices = await navigator.bluetooth.getDevices();
    console.log(devices);
    if (devices.length > 0) {
      connectToBluetoothDevice(devices[0]);
    }
  };

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
    setBatteryLevel(new TextDecoder().decode(value) + "%");
  };

  /**
   * Attempts to connect to a Bluetooth device and subscribe to
   * battery level readings using the battery service.
   */
  const connectToDeviceAndSubscribeToUpdates = async () => {
    try {
      //   Search for Bluetooth devices that advertise a battery service
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "CIRCUITPY3506" }],
        optionalServices: [
          uartServiceUUID,
          //   RX_characteristic,
          //   TX_characteristic,
        ],
      });
      //   const devices = await navigator.bluetooth.getDevices();
      //   console.log(devices);

      setIsDisconnected(false);

      // Add an event listener to detect when a device disconnects
      device.addEventListener("gattserverdisconnected", onDisconnected);

      // Try to connect to the remote GATT Server running on the Bluetooth device
      const server = await device?.gatt?.connect();

      // Get the battery service from the Bluetooth device
      const uartService = await server?.getPrimaryService(uartServiceUUID);

      // Get the battery level characteristic from the Bluetooth device
      const characteristic = await uartService?.getCharacteristic(
        RX_characteristic
      );

      // Subscribe to battery level notifications
      characteristic?.startNotifications();

      // When the battery level changes, call a function
      characteristic?.addEventListener(
        "characteristicvaluechanged",
        handleCharacteristicValueChanged
      );

      //   // Read the battery level value
      //   const reading = await characteristic.readValue();

      //   // Show the initial reading on the web page
      //   setBatteryLevel(reading.getUint8(0) + "%");
    } catch (error) {
      console.log(`There was an error: ${error}`);
    }
  };

  async function connectToBluetoothDevice(device: BluetoothDevice) {
    const abortController = new AbortController();

    const handleAdvertisement = async (event: Event) => {
      console.log('> Received advertisement from "' + device.name + '"...');
      console.log(event);
      // Stop watching advertisements to conserve battery life.
      abortController.abort();
      console.log('Connecting to GATT Server from "' + device.name + '"...');
      try {
        await device?.gatt?.connect();
        console.log('> Bluetooth device "' + device.name + " connected.");
      } catch (error) {
        console.log("Argh! " + error);
      }
    };

    device.addEventListener("advertisementreceived", handleAdvertisement);

    try {
      console.log('Watching advertisements from "' + device.name + '"...');
      await device.watchAdvertisements({ signal: abortController.signal });
    } catch (error) {
      console.log("Argh! " + error);
    }
  }

  return (
    <div className="App">
      <h1>Get Device Battery Info Over Bluetooth</h1>
      {supportsBluetooth && !isDisconnected && (
        <p>Battery level: {batteryLevel}</p>
      )}
      {supportsBluetooth && isDisconnected && (
        <button onClick={connectToDeviceAndSubscribeToUpdates}>
          Connect to a Bluetooth device
        </button>
      )}
      <button onClick={getDevices}>Get devices</button>
      {!supportsBluetooth && (
        <p>This browser doesn't support the Web Bluetooth API</p>
      )}
    </div>
  );
}

export default BluetoothTesting;
