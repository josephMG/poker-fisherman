import { useState } from "react";
import { AVATARS } from "../constants";
import { Avatar, Player } from "../types";
import { Button } from "./ui/Button";
import { motion } from "motion/react";

type Props = {
  onComplete: (p1: Avatar, p2: Avatar) => void;
};

const ANIMATION_VARIANTS = [
  // 0: Bounce & Wiggle
  {
    y: [0, -15, 0, -15, 0],
    scale: [1, 1.3, 1, 1.3, 1],
    rotate: [0, -10, 10, -10, 10, 0],
  },
  // 1: Spin Jump
  {
    y: [0, -20, 0],
    scale: [1, 1.4, 1],
    rotate: [0, 180, 360],
  },
  // 2: Jelly/Squish Jump
  {
    y: [0, -25, 0],
    scaleX: [1, 0.7, 1.3, 0.9, 1],
    scaleY: [1, 1.3, 0.7, 1.1, 1],
  }
];

export default function AvatarSelect({ onComplete }: Props) {
  const [player1, setPlayer1] = useState<Avatar | null>(null);
  const [player2, setPlayer2] = useState<Avatar | null>(null);
  const [animVariants, setAnimVariants] = useState<Record<string, number>>({});

  const currentPlayerPick = player1 === null ? 1 : 2;

  const handleSelect = (avatar: Avatar) => {
    if (player1?.id === avatar.id || player2?.id === avatar.id) return; // already picked

    // Assign a random animation type (0, 1, or 2)
    setAnimVariants(prev => ({ ...prev, [avatar.id]: Math.floor(Math.random() * 3) }));

    if (currentPlayerPick === 1) {
      setPlayer1(avatar);
    } else {
      setPlayer2(avatar);
    }
  };

  const handleReset = () => {
    setPlayer1(null);
    setPlayer2(null);
    setAnimVariants({});
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-blue-50 p-2 sm:p-4 md:p-6 font-sans">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full h-full max-h-full md:h-auto overflow-hidden bg-white p-4 pt-16 md:pt-8 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border-4 md:border-8 border-yellow-300 max-w-4xl flex flex-col items-center"
      >
        <div className="absolute top-3 left-3 md:top-6 md:left-6 z-50">
            <Button variant="outline" size="sm" onClick={handleReset} className="bg-white/80 backdrop-blur-sm shadow-sm text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-1.5 md:px-4 md:py-2 rounded-xl border-2 hover:bg-gray-100 flex items-center">
              ⬅️ 重新選擇
            </Button>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-blue-600 mb-2 md:mb-8 text-center drop-shadow-sm shrink-0">
            {player1 && player2
              ? "準備好開始了嗎？"
              : `請玩家 ${currentPlayerPick} 選擇動物！`}
          </h1>

          <div className="overflow-y-auto w-full flex-1 min-h-0 px-2 py-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-6 w-full max-w-[400px] md:max-w-none mx-auto pb-4">
              {AVATARS.map((avatar) => {
            const isP1 = player1?.id === avatar.id;
            const isP2 = player2?.id === avatar.id;
            const isSelected = isP1 || isP2;

            return (
              <motion.button
                key={avatar.id}
                whileHover={{ scale: isSelected ? 1 : 1.1 }}
                whileTap={{ scale: isSelected ? 1 : 0.9 }}
                onClick={() => handleSelect(avatar)}
                className={`relative flex flex-row md:flex-col items-center justify-center p-3 sm:p-4 rounded-[1.5rem] md:rounded-3xl gap-2 md:gap-0 transition-all ${
                  isSelected
                    ? "bg-gray-200 cursor-not-allowed opacity-50"
                    : "bg-orange-100 hover:bg-orange-200 border-[3px] md:border-4 border-orange-300 hover:border-orange-400 shadow-sm md:shadow-md"
                }`}
              >
                <motion.span
                  animate={
                    isSelected
                      ? ANIMATION_VARIANTS[animVariants[avatar.id] ?? 0]
                      : { y: 0, scale: 1, rotate: 0, scaleX: 1, scaleY: 1 }
                  }
                  transition={{ duration: 0.6, type: "tween" }}
                  className="text-4xl sm:text-5xl md:text-7xl origin-bottom inline-block z-10"
                >
                  {avatar.emoji}
                </motion.span>
                <span className="mt-0 md:mt-2 text-base sm:text-lg md:text-xl font-bold text-gray-700 whitespace-nowrap">
                  {avatar.name}
                </span>

                {isP1 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    className="absolute -top-3 -right-3 bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-md z-20"
                  >
                    P1
                  </motion.div>
                )}
                {isP2 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.6 }}
                    className="absolute -top-3 -right-3 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-md z-20"
                  >
                    P2
                  </motion.div>
                )}
              </motion.button>
            );
          })}
            </div>
          </div>

        <div className="flex gap-4 w-full md:w-auto px-4 mt-4 md:mt-0 shrink-0">
          <Button
            size="lg"
            variant="primary"
            disabled={!player1 || !player2}
            onClick={() => onComplete(player1!, player2!)}
            className="w-full bg-green-500 hover:bg-green-600 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 text-base sm:text-lg md:text-xl py-3 md:py-3 md:min-w-[200px]"
          >
            下一步 ➡️
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
