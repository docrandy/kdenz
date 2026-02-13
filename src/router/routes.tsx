import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../app/AppLayout";
import DashboardPage from "../pages/Dashboard";
import VoiceLabPage from "../pages/VoiceLabPage";
import SkillsPage from "../pages/SkillsPage";
import SettingsPage from "../pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "voicelab", element: <VoiceLabPage /> },
      { path: "skills", element: <SkillsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
