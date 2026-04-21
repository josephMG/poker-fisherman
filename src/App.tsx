import { useState } from "react";
import AvatarSelect from "./components/AvatarSelect";
import DifficultySelect from "./components/DifficultySelect";
import GameBoard from "./components/GameBoard";
import Victory from "./components/Victory";
import { Avatar, Difficulty, Level } from "./types";

type ScreenState = "PLAYER_SELECT" | "SETTINGS" | "GAME" | "VICTORY";

export default function App() {
  const [screen, setScreen] = useState<ScreenState>("PLAYER_SELECT");

  const [p1Avatar, setP1Avatar] = useState<Avatar | null>(null);
  const [p2Avatar, setP2Avatar] = useState<Avatar | null>(null);

  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [level, setLevel] = useState<Level>("BEGINNER");
  const [isMemoryMode, setIsMemoryMode] = useState(false);

  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const handleAvatarComplete = (p1: Avatar, p2: Avatar) => {
    setP1Avatar(p1);
    setP2Avatar(p2);
    setScreen("SETTINGS");
  };

  const handleStartGame = (diff: Difficulty, lvl: Level, memory: boolean) => {
    setDifficulty(diff);
    setLevel(lvl);
    setIsMemoryMode(memory);
    setScreen("GAME");
  };

  const handleGameOver = (score1: number, score2: number) => {
    setP1Score(score1);
    setP2Score(score2);
    setScreen("VICTORY");
  };

  const handleRestart = () => {
    setScreen("PLAYER_SELECT");
    setP1Avatar(null);
    setP2Avatar(null);
    setP1Score(0);
    setP2Score(0);
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {screen === "PLAYER_SELECT" && (
        <AvatarSelect onComplete={handleAvatarComplete} />
      )}
      {screen === "SETTINGS" && (
        <DifficultySelect
          onStart={handleStartGame}
          onBack={() => setScreen("PLAYER_SELECT")}
        />
      )}
      {screen === "GAME" && p1Avatar && p2Avatar && (
        <GameBoard
          p1Avatar={p1Avatar}
          p2Avatar={p2Avatar}
          difficulty={difficulty}
          level={level}
          isMemoryMode={isMemoryMode}
          onGameOver={handleGameOver}
          onQuit={handleRestart}
        />
      )}
      {screen === "VICTORY" && p1Avatar && p2Avatar && (
        <Victory
          p1Avatar={p1Avatar}
          p2Avatar={p2Avatar}
          p1Score={p1Score}
          p2Score={p2Score}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
