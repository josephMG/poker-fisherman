import { useState } from "react";
import { Difficulty, Level } from "../types";
import { Button } from "./ui/Button";
import { motion } from "motion/react";

type Props = {
  onStart: (difficulty: Difficulty, level: Level, isMemoryMode: boolean) => void;
  onBack: () => void;
};

export default function DifficultySelect({ onStart, onBack }: Props) {
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [level, setLevel] = useState<Level>("BEGINNER");
  const [isMemoryMode, setIsMemoryMode] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-green-50 p-2 sm:p-4 md:p-6 font-sans">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-4 sm:p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border-4 md:border-8 border-orange-300 w-full max-w-3xl flex flex-col items-center relative overflow-hidden my-4"
      >
        <div className="absolute top-3 left-3 md:top-6 md:left-6 z-50">
          <Button variant="outline" size="sm" onClick={onBack} className="bg-white/80 backdrop-blur-sm shadow-sm text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-1.5 md:px-4 md:py-2 rounded-xl border-2 hover:bg-gray-100 flex items-center">
            ⬅️ 返回
          </Button>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-orange-500 mb-4 sm:mb-6 md:mb-8 text-center drop-shadow-sm mt-10 sm:mt-12 md:mt-4">
          遊戲設定
        </h1>

        <div className="w-full mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-2 sm:mb-3 md:mb-4 text-center">選擇難度 (牌的數量)</h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`py-2 px-1 sm:p-4 md:p-6 rounded-[1rem] md:rounded-3xl font-bold text-sm sm:text-xl md:text-2xl border-[3px] md:border-4 transition-all shadow-sm md:shadow-md flex flex-col items-center justify-center gap-0.5 sm:gap-1 ${
                  difficulty === d
                    ? "bg-blue-100 border-blue-500 text-blue-700 md:scale-105"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {d === "EASY" && <><span className="whitespace-nowrap">簡單</span><span className="text-xs sm:text-base md:text-lg opacity-80">(A-6)</span></>}
                {d === "MEDIUM" && <><span className="whitespace-nowrap">中等</span><span className="text-xs sm:text-base md:text-lg opacity-80">(A-10)</span></>}
                {d === "HARD" && <><span className="whitespace-nowrap">困難</span><span className="text-xs sm:text-base md:text-lg opacity-80">(A-K)</span></>}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full mb-4 sm:mb-6 md:mb-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-2 sm:mb-3 md:mb-4 text-center">選擇等級 (花色變化)</h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setLevel("BEGINNER")}
              className={`py-3 px-2 sm:p-4 md:p-6 rounded-[1rem] md:rounded-3xl font-bold text-base sm:text-xl md:text-2xl border-[3px] md:border-4 transition-all shadow-sm md:shadow-md flex flex-col items-center justify-center gap-0.5 sm:gap-1 ${
                level === "BEGINNER"
                  ? "bg-pink-100 border-pink-500 text-pink-700 md:scale-105"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span>初階</span>
              <span className="text-xs sm:text-base md:text-lg font-medium opacity-80">(隨機2種花色)</span>
            </button>
            <button
              onClick={() => setLevel("ADVANCED")}
              className={`py-3 px-2 sm:p-4 md:p-6 rounded-[1rem] md:rounded-3xl font-bold text-base sm:text-xl md:text-2xl border-[3px] md:border-4 transition-all shadow-sm md:shadow-md flex flex-col items-center justify-center gap-0.5 sm:gap-1 ${
                level === "ADVANCED"
                  ? "bg-purple-100 border-purple-500 text-purple-700 md:scale-105"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span>進階</span>
              <span className="text-xs sm:text-base md:text-lg font-medium opacity-80">(全部4種花色)</span>
            </button>
          </div>
        </div>

        <div className="w-full mb-4 sm:mb-6 md:mb-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-2 sm:mb-3 md:mb-4 text-center">選擇模式 (特殊規則)</h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <button
              onClick={() => setIsMemoryMode(false)}
              className={`py-3 px-2 sm:p-4 md:p-6 rounded-[1rem] md:rounded-3xl font-bold text-base sm:text-xl md:text-2xl border-[3px] md:border-4 transition-all shadow-sm md:shadow-md flex flex-col items-center justify-center gap-0.5 sm:gap-1 ${
                !isMemoryMode
                  ? "bg-teal-100 border-teal-500 text-teal-700 md:scale-105"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span>經典模式</span>
              <span className="text-xs sm:text-base md:text-lg font-medium opacity-80">(直接開始)</span>
            </button>
            <button
              onClick={() => setIsMemoryMode(true)}
              className={`py-3 px-1 sm:p-4 md:p-6 rounded-[1rem] md:rounded-3xl font-bold text-sm sm:text-xl md:text-2xl border-[3px] md:border-4 transition-all shadow-sm md:shadow-md flex flex-col items-center justify-center gap-0.5 sm:gap-1 ${
                isMemoryMode
                  ? "bg-indigo-100 border-indigo-500 text-indigo-700 md:scale-105"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span className="whitespace-nowrap tracking-tighter sm:tracking-normal">訓練記憶模式</span>
              <span className="text-xs sm:text-base md:text-lg font-medium opacity-80">(預覽10秒)</span>
            </button>
          </div>
        </div>

        <div className="flex w-full px-0 md:px-10 mt-2 sm:mt-6 md:mt-8 justify-center">
          <Button
            size="lg"
            variant="primary"
            onClick={() => onStart(difficulty, level, isMemoryMode)}
            className="w-full text-center py-3 sm:py-4 md:py-3 sm:w-3/4 max-w-lg bg-yellow-400 text-orange-900 hover:bg-yellow-500 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 text-base sm:text-lg md:text-3xl font-bold"
          >
            共 {(difficulty === "EASY" ? 6 : difficulty === "MEDIUM" ? 10 : 13) * (level === "BEGINNER" ? 2 : 4)} 張，出發釣魚去！ 🎣
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
