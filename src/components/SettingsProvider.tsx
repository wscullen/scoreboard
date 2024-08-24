import { PropsWithChildren, createContext, useEffect, useState } from "react";

// Define the settings context
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => void;
}

// Define the settings object
interface Settings {
  // Define your settings properties here
  enableSound: boolean;
  enableGoalOverlay: boolean;
  overlayDuration: number;
}

// Create the settings context
export const SettingsContext = createContext<SettingsContextType>({
  settings: { enableSound: true, enableGoalOverlay: true, overlayDuration: 5 },
  updateSettings: () => {},
});

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState<Settings>({
    enableSound: true,
    enableGoalOverlay: true,
    overlayDuration: 5,
  });

  useEffect(() => {
    const enableSound = localStorage.getItem("enableSound");
    if (enableSound) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        enableSound: enableSound === "true",
      }));
    }

    const enableGoalOverlay = localStorage.getItem("enableGoalOverlay");
    if (enableGoalOverlay) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        enableGoalOverlay: enableGoalOverlay === "true",
      }));
    }

    const overlayDuration = localStorage.getItem("overlayDuration");
    if (overlayDuration) {
      setSettings((prevSettings) => ({
        ...prevSettings,
        overlayDuration: Number(overlayDuration),
      }));
    }
  }, []);

  const updateSettings = (newSettings: Settings) => {
    localStorage.setItem("enableSound", String(newSettings.enableSound));
    localStorage.setItem(
      "enableGoalOverlay",
      String(newSettings.enableGoalOverlay)
    );
    localStorage.setItem(
      "overlayDuration",
      String(newSettings.overlayDuration)
    );
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
