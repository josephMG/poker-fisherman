import { CardData } from "../types";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import React, { useState } from "react";

type Props = {
  card: CardData;
  onClick?: () => void;
  layoutId?: string;
  className?: string;
  style?: React.CSSProperties;
};

const PIPS: Record<string, { x: number; y: number; flip?: boolean; scale?: number }[]> = {
  A: [{ x: 50, y: 50, scale: 2.2 }],
  "2": [{ x: 50, y: 0 }, { x: 50, y: 100, flip: true }],
  "3": [{ x: 50, y: 0 }, { x: 50, y: 50 }, { x: 50, y: 100, flip: true }],
  "4": [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100, flip: true }, { x: 100, y: 100, flip: true }],
  "5": [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 50 }, { x: 0, y: 100, flip: true }, { x: 100, y: 100, flip: true }],
  "6": [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 50 }, { x: 100, y: 50 }, { x: 0, y: 100, flip: true }, { x: 100, y: 100, flip: true }],
  "7": [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 25 }, { x: 0, y: 50 }, { x: 100, y: 50 }, { x: 0, y: 100, flip: true }, { x: 100, y: 100, flip: true }],
  "8": [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 25 }, { x: 0, y: 50 }, { x: 100, y: 50 }, { x: 50, y: 75, flip: true }, { x: 0, y: 100, flip: true }, { x: 100, y: 100, flip: true }],
  "9": [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 30 }, { x: 100, y: 30 }, { x: 50, y: 50 }, { x: 0, y: 70, flip: true }, { x: 100, y: 70, flip: true }, { x: 0, y: 100, flip: true }, { x: 100, y: 100, flip: true }],
  "10": [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 16 }, { x: 0, y: 33 }, { x: 100, y: 33 }, { x: 0, y: 66, flip: true }, { x: 100, y: 66, flip: true }, { x: 50, y: 84, flip: true }, { x: 0, y: 100, flip: true }, { x: 100, y: 100, flip: true }],
};

const FACE_CARDS: Record<string, string> = {
  J: "💂",
  Q: "👸",
  K: "🤴",
};

export default function Card({ card, onClick, layoutId, className, style }: Props) {
  const [fishPos, setFishPos] = useState({ x: 0, y: 0, rotate: 0 });

  const scareFish = () => {
    if (card.isFlipped || card.isMatched) return;
    const paddingX = 80; // max 80% out from center
    const paddingY = 120; // max 120% out from center 
    setFishPos({
      x: (Math.random() - 0.5) * paddingX,
      y: (Math.random() - 0.5) * paddingY,
      rotate: (Math.random() - 0.5) * 120, // spin out wildly
    });
  };

  // Use a wrapper motion.div to position it, and an inner motion.div for the 3D flip.
  return (
    <motion.div
      layoutId={layoutId} // Framer Motion magic linking for animated transitions across DOM trees
      className={cn("cursor-pointer", className)}
      style={{ containerType: "inline-size", ...style }}
      onClick={card.isMatched ? undefined : onClick}
      whileHover={card.isFlipped || card.isMatched ? {} : { scale: 1.05, y: -4 }}
      whileTap={card.isFlipped || card.isMatched ? {} : { scale: 0.95 }}
    >
      <motion.div
        className="w-full h-full relative"
        initial={false}
        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card (Face Down from player perspective) */}
        <div
          className="absolute inset-0 w-full h-full rounded-[8cqi] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm border-[2cqi] border-white flex items-center justify-center backface-hidden overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
          onPointerEnter={scareFish}
        >
          <div className="absolute inset-[3.5cqi] rounded-[5cqi] border-[1.5cqi] border-dashed border-white/50 pointer-events-none" />
          <motion.span 
            animate={{ x: `${fishPos.x}%`, y: `${fishPos.y}%`, rotate: fishPos.rotate }}
            transition={{ type: "spring", stiffness: 350, damping: 10, mass: 0.8 }}
            style={{ fontSize: "35cqi", display: "inline-block" }}
            className="drop-shadow-md z-10 pointer-events-auto"
            onPointerEnter={scareFish}
          >
            🐟
          </motion.span>
        </div>

          {/* Back of Card (Face Up from player perspective) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-[8cqi] bg-white shadow-xl flex border-[2.5cqi] backface-hidden ${
            card.isMatched ? "border-green-400 bg-green-50 shadow-green-200" : "border-gray-200"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Top-Left Corner: Mobile (Rank only) / Desktop (Rank + Suit) */}
          <div className={`absolute top-[4cqi] left-[6cqi] flex flex-col items-center ${card.color}`}>
            <div className="hidden md:flex flex-col items-center">
              <span className="font-bold -mb-[2cqi] text-[16cqi]" style={{ lineHeight: 1 }}>{card.rank}</span>
              <span className="text-[12cqi] -ml-[2cqi]" style={{ lineHeight: 1 }}>{card.suit}</span>
            </div>
            <div className="md:hidden mt-[2cqi]">
              <span className="font-extrabold text-[40cqi] tracking-tighter" style={{ lineHeight: 1 }}>{card.rank}</span>
            </div>
          </div>

          {/* Bottom-Right Corner: Mobile (Suit only) / Desktop (Rank + Suit Inverted) */}
          <div className={`absolute bottom-[2cqi] right-[6cqi] flex flex-col items-center ${card.color}`}>
            <div className="hidden md:flex flex-col items-center rotate-180">
              <span className="font-bold -mb-[2cqi] text-[16cqi]" style={{ lineHeight: 1 }}>{card.rank}</span>
              <span className="text-[12cqi] -ml-[2cqi]" style={{ lineHeight: 1 }}>{card.suit}</span>
            </div>
            <div className="md:hidden mb-[2cqi]">
              <span className="text-[40cqi]" style={{ lineHeight: 1 }}>{card.suit}</span>
            </div>
          </div>

          {/* Center Area: Desktop Only */}
          <div className="hidden md:block absolute top-[22%] bottom-[22%] left-[25%] right-[25%] pointer-events-none">
            {/* Desktop: Full Pips / Big Emoji */}
            <div className="w-full h-full relative">
              {PIPS[card.rank] ? (
                PIPS[card.rank].map((pip, i) => (
                  <div
                    key={i}
                    className={`absolute flex items-center justify-center ${card.color}`}
                    style={{
                      left: `${pip.x}%`,
                      top: `${pip.y}%`,
                      transform: `translate(-50%, -50%) ${pip.flip ? "rotate(180deg)" : ""} scale(${pip.scale || 1})`,
                      fontSize: "20cqi",
                      lineHeight: 1,
                    }}
                  >
                    {card.suit}
                  </div>
                ))
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ fontSize: "40cqi", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
                >
                  {FACE_CARDS[card.rank]}
                </div>
              )}
            </div>
          </div>

          {/* Matched overlay sparkle effect (temporary) */}
          {card.isMatched && (
             <motion.div
               initial={{ scale: 0, opacity: 1, rotate: 0 }}
               animate={{ scale: [0, 1.5, 1], opacity: [1, 1, 0], rotate: [0, 180, 360] }}
               transition={{ duration: 0.8 }}
               className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
             >
               <span style={{ fontSize: "40cqi" }} className="drop-shadow-md">✨</span>
             </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
