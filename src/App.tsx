import "./App.css";
import Scoreboard from "./components/Scoreboard";
import { SettingsProvider } from "./components/SettingsProvider";

function App() {
  return (
    <div className="@container/main flex h-dvh w-dvw overflow-hidden">
      <SettingsProvider>
        <Scoreboard />
      </SettingsProvider>
    </div>
  );
}

export default App;
