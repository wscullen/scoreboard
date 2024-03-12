import "./App.css";
// import Scoreboard from "./components/Scoreboard";
import BluetoothTesting from "./components/BluetoothTesting";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div className="flex h-dvh w-dvw overflow-hidden">
      <BluetoothTesting />
    </div>
  );
}

export default App;
