import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Avatar } from "../types";
import { Button } from "./ui/Button";
import { motion } from "motion/react";
import { soundManager } from "../lib/sounds";

type Props = {
  p1Avatar: Avatar;
  p2Avatar: Avatar;
  p1Score: number;
  p2Score: number;
  onRestart: () => void;
};

export default function Victory({ p1Avatar, p2Avatar, p1Score, p2Score, onRestart }: Props) {
  const isTie = p1Score === p2Score;
  const winner = p1Score > p2Score ? 1 : 2;
  const winnerAvatar = winner === 1 ? p1Avatar : p2Avatar;
  const loserAvatar = winner === 1 ? p2Avatar : p1Avatar;

  useEffect(() => {
    // Play win sound
    soundManager.play('win');

    // Fireworks effect!
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-50 p-6 font-sans">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="bg-white p-8 md:p-12 rounded-[3xl] shadow-2xl border-[12px] border-yellow-400 w-full max-w-2xl flex flex-col items-center text-center relative overflow-hidden"
        style={{ borderRadius: "3rem" }}
      >
        {isTie ? (
          <div>
             <h1 className="text-5xl md:text-6xl font-extrabold text-blue-500 mb-6 drop-shadow-md">
               平手！大家都好棒！
             </h1>
             <div className="flex justify-center gap-8 mb-8 text-7xl md:text-9xl">
               <motion.span animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 1 }}>{p1Avatar.emoji}</motion.span>
               <motion.span animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}>{p2Avatar.emoji}</motion.span>
             </div>
          </div>
        ) : (
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 mb-8 drop-shadow-md">
              🎊 遊戲結束 🎊
            </h1>
            
            <div className="relative inline-block mb-10">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-8xl md:text-9xl"
              >
                {winnerAvatar.emoji}
              </motion.div>
              <div className="absolute -top-6 -right-6 text-5xl rotate-12">👑</div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              恭喜 玩家 {winner} 獲勝！
            </h2>
            <p className="text-2xl text-gray-600 font-medium mb-2">得標了 {Math.max(p1Score, p2Score)} 分</p>
          </div>
        )}

        <div className="mt-8">
           <Button size="lg" variant="primary" onClick={onRestart} className="bg-purple-500 hover:bg-purple-600 border-b-4 border-purple-700">
             再玩一次 🎮
           </Button>
        </div>
      </motion.div>
    </div>
  );
}
