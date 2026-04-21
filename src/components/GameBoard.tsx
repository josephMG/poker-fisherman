import { useEffect, useState, useRef } from "react";
import { Avatar, CardData, Difficulty, Level, Player } from "../types";
import { RANKS, SUITS } from "../constants";
import Card from "./Card";
import { Button } from "./ui/Button";
import { motion, LayoutGroup, AnimatePresence } from "motion/react";

const SCORE_ANIMS = [
  { rotateX: [0, -360], scale: [1, 1.4, 1], y: [0, -20, 0] },
  { rotateY: [0, 360], scale: [1, 1.3, 1], x: [0, 15, -15, 0] },
  { rotateZ: [0, -20, 20, -20, 20, 0], scale: [1, 1.4, 1], y: [0, -10, 0] }
];

function AnimatedAvatar({ emoji, score, className }: { emoji: string, score: number, className?: string }) {
  const [anim, setAnim] = useState<any>({});
  const prevScore = useRef(score);

  useEffect(() => {
    if (score > prevScore.current) {
      setAnim(SCORE_ANIMS[Math.floor(Math.random() * SCORE_ANIMS.length)]);
      const timer = setTimeout(() => setAnim({}), 600);
      prevScore.current = score;
      return () => clearTimeout(timer);
    }
  }, [score]);

  return (
    <motion.div
      animate={anim}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{ transformStyle: "preserve-3d", display: "flex" }}
      className={className}
    >
      {emoji}
    </motion.div>
  );
}

type Props = {
  p1Avatar: Avatar;
  p2Avatar: Avatar;
  difficulty: Difficulty;
  level: Level;
  isMemoryMode: boolean;
  onGameOver: (p1Score: number, p2Score: number) => void;
  onQuit: () => void;
};

export default function GameBoard({ p1Avatar, p2Avatar, difficulty, level, isMemoryMode, onGameOver, onQuit }: Props) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, avatar: p1Avatar, score: 0 },
    { id: 2, avatar: p2Avatar, score: 0 },
  ]);
  const [currentTurnId, setCurrentTurnId] = useState<1 | 2>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchesCount, setMatchesCount] = useState(0);
  const [previewCountdown, setPreviewCountdown] = useState(isMemoryMode ? 10 : 0);
  
  // Responsive board calculation
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (boardRef.current && boardRef.current.clientWidth > 0) {
        setBoardSize({
          w: boardRef.current.clientWidth,
          h: boardRef.current.clientHeight
        });
      }
    };
    
    // Initial size
    updateSize();
    
    const observer = new ResizeObserver(updateSize);
    if (boardRef.current) observer.observe(boardRef.current);
    window.addEventListener('resize', updateSize);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Initialize deck
  useEffect(() => {
    const ranks = RANKS[difficulty];
    let selectedSuits = SUITS;

    if (level === "BEGINNER") {
      // Pick 2 random suits (prefer one red, one black for visibility)
      const blackSuits = SUITS.filter(s => s.color.includes("text-slate"));
      const redSuits = SUITS.filter(s => s.color.includes("text-red"));
      const s1 = blackSuits[Math.floor(Math.random() * blackSuits.length)];
      const s2 = redSuits[Math.floor(Math.random() * redSuits.length)];
      selectedSuits = [s1, s2];
    }

    let deck: CardData[] = [];
    ranks.forEach(rank => {
      selectedSuits.forEach(suit => {
        deck.push({
          id: Math.random().toString(36).substring(7),
          rank,
          suit: suit.symbol,
          color: suit.color,
          isFlipped: isMemoryMode,
          isMatched: false,
        });
      });
    });

    // Shuffle
    deck.sort(() => Math.random() - 0.5);
    setCards(deck);
  }, [difficulty, level, isMemoryMode]);

  useEffect(() => {
    if (!isMemoryMode) return;
    if (previewCountdown > 0) {
      const t = setTimeout(() => setPreviewCountdown(p => p - 1), 1000);
      return () => clearTimeout(t);
    } else if (previewCountdown === 0) {
      setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
    }
  }, [previewCountdown, isMemoryMode]);

  const totalPairs = cards.length / 2;

  const handleCardClick = (index: number) => {
    if (previewCountdown > 0) return;
    if (isProcessing) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [idx1, idx2] = newFlipped;
      const c1 = newCards[idx1];
      const c2 = newCards[idx2];

      if (c1.rank === c2.rank) {
        // Match!
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[idx1].isMatched = true;
          matchedCards[idx1].matchedBy = currentTurnId;
          matchedCards[idx2].isMatched = true;
          matchedCards[idx2].matchedBy = currentTurnId;
          setCards(matchedCards);
          setFlippedIndices([]);
          setIsProcessing(false);

          setPlayers(prev => prev.map(p => {
             if(p.id === currentTurnId) {
               return {...p, score: p.score + 1};
             }
             return p;
          }));
          
          setMatchesCount(prev => prev + 1);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          const unflippedCards = [...newCards];
          unflippedCards[idx1].isFlipped = false;
          unflippedCards[idx2].isFlipped = false;
          setCards(unflippedCards);
          setFlippedIndices([]);
          setCurrentTurnId(prev => prev === 1 ? 2 : 1);
          setIsProcessing(false);
        }, 1500);
      }
    }
  };

  // Check game over
  useEffect(() => {
    if (cards.length > 0 && matchesCount === totalPairs) {
       setTimeout(() => {
         onGameOver(players[0].score, players[1].score);
       }, 800);
    }
  }, [matchesCount, totalPairs, cards.length]);

  const p1Matched = cards.filter(c => c.isMatched && c.matchedBy === 1);
  const p2Matched = cards.filter(c => c.isMatched && c.matchedBy === 2);

  // Dynamic layout calculation
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  let gridCols = 4;
  let gridMaxWidth = "100%";
  
  if (boardSize.w > 0 && boardSize.h > 0 && cards.length > 0) {
    const totalCards = cards.length;
    let minCols = 2;
    let maxCols = 8;
    
    if (isMobile) {
      minCols = 3;
      maxCols = 6;
    } else {
      minCols = 4;
      maxCols = 10;
    }

    let bestWidth = 0;
    let bestC = 4;
    
    const gap = isMobile ? 6 : 12;

    for (let c = minCols; c <= maxCols; c++) {
      const r = Math.ceil(totalCards / c);
      
      const availableWidth = boardSize.w - (isMobile ? 24 : 48);
      const availableHeight = boardSize.h - (isMobile ? 24 : 48);
      
      let w = (availableWidth - gap * (c - 1)) / c;
      let h = w * 1.4; // aspect ratio 3.5/2.5 = 1.4
      
      // If it overflows height, bounded by height
      if (Math.ceil(h * r + gap * (r - 1)) > availableHeight) {
        h = (availableHeight - gap * (r - 1)) / r;
        w = h / 1.4;
      }
      
      if (w > bestWidth) {
        bestWidth = w;
        bestC = c;
      }
    }
    
    gridCols = bestC;
    // Maximum card width to avoid looking insanely huge on 4k screens
    const cardW = Math.min(Math.floor(bestWidth), 180);
    gridMaxWidth = `${(cardW * bestC) + (gap * (bestC - 1))}px`;
  }

  return (
    <LayoutGroup>
      <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-sky-50 font-sans overflow-hidden">
        
        {/* Mobile Header: Players Side by Side OR Countdown */}
        <div className="md:hidden flex w-full bg-slate-100 shadow-md z-20 shrink-0 border-b-2 border-slate-200">
          
          {/* Mobile Quit Button (Always visible) */}
          <div className="flex-[1] flex items-center justify-center p-1.5 border-r-2 border-slate-200 bg-white/50">
             <Button variant="outline" size="sm" onClick={onQuit} className="w-full h-full p-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm md:shadow-md rounded-xl hover:bg-gray-100 border-2 border-slate-200 gap-0.5">
               <span className="text-sm">⬅️</span>
               <span className="text-[10px] font-bold text-gray-600">放棄</span>
             </Button>
          </div>

          {previewCountdown > 0 ? (
            /* Mobile Countdown mode */
            <div className="flex-[4] flex justify-center items-center p-1.5 bg-indigo-50">
              <div className="bg-white/90 px-4 py-1.5 rounded-full border-2 border-indigo-400 shadow-sm flex items-center gap-2 justify-center">
                <div className="font-bold text-indigo-800 text-lg">👀 記憶時間</div>
                <div className="text-3xl font-extrabold text-orange-500 w-8 text-center">{previewCountdown}</div>
              </div>
            </div>
          ) : (
            /* Mobile Players mode */
            <>
              {/* Mobile Player 1 */}
              <div className="flex-[2] flex justify-center p-1.5 border-r-2 border-slate-200 bg-blue-50/50">
                <motion.div
                  animate={{ scale: currentTurnId === 1 ? 1.05 : 0.95, opacity: currentTurnId === 1 ? 1 : 0.6 }}
                  className={`p-1.5 w-full flex justify-between items-center rounded-2xl border-[3px] ${currentTurnId === 1 ? 'bg-yellow-100 border-yellow-400 shadow-sm' : 'bg-white border-blue-200 text-gray-500'}`}
                >
                  <div className="flex items-center gap-1.5">
                    <AnimatedAvatar emoji={p1Avatar.emoji} score={players[0].score} className="text-2xl justify-center bg-white/50 rounded-full w-8 h-8 items-center shrink-0" />
                    <div className="text-left font-bold text-xs uppercase tracking-wider hidden sm:block whitespace-nowrap overflow-hidden text-ellipsis">{p1Avatar.name}</div>
                  </div>
                  <div className="text-center font-extrabold text-blue-600 text-2xl pr-1 shrink-0">{players[0].score}</div>
                </motion.div>
              </div>
              
              {/* Mobile Player 2 */}
              <div className="flex-[2] flex justify-center p-1.5 bg-red-50/50">
                 <motion.div
                  animate={{ scale: currentTurnId === 2 ? 1.05 : 0.95, opacity: currentTurnId === 2 ? 1 : 0.6 }}
                  className={`p-1.5 w-full flex justify-between items-center rounded-2xl border-[3px] flex-row-reverse ${currentTurnId === 2 ? 'bg-yellow-100 border-yellow-400 shadow-sm' : 'bg-white border-red-200 text-gray-500'}`}
                >
                  <div className="flex items-center gap-1.5 flex-row-reverse">
                    <AnimatedAvatar emoji={p2Avatar.emoji} score={players[1].score} className="text-2xl justify-center bg-white/50 rounded-full w-8 h-8 items-center shrink-0" />
                    <div className="text-right font-bold text-xs uppercase tracking-wider hidden sm:block whitespace-nowrap overflow-hidden text-ellipsis">{p2Avatar.name}</div>
                  </div>
                  <div className="text-center font-extrabold text-blue-600 text-2xl pl-1 shrink-0">{players[1].score}</div>
                </motion.div>
              </div>
            </>
          )}
        </div>

        {/* Desktop Player 1 Sidebar */}
        <div className="hidden md:flex md:w-[220px] shrink-0 bg-blue-100 border-r-4 border-blue-200 flex-col items-center justify-start px-4 py-8 shadow-md z-20">
          <div className="flex flex-col items-center w-full">
            <motion.div
              animate={{ scale: currentTurnId === 1 ? 1.05 : 0.95, opacity: currentTurnId === 1 ? 1 : 0.6 }}
              className={`w-full flex-col p-4 rounded-3xl border-[6px] ${currentTurnId === 1 ? 'bg-yellow-100 border-yellow-400 shadow-lg' : 'bg-white border-blue-200 text-gray-500'}`}
            >
              <div className="flex flex-col items-center gap-0">
                <AnimatedAvatar emoji={p1Avatar.emoji} score={players[0].score} className="text-7xl justify-center bg-transparent rounded-none w-auto h-auto items-center" />
                <div className="text-center font-bold text-xl uppercase tracking-wider mt-2">{p1Avatar.name}</div>
              </div>
              <div className="text-center font-extrabold text-blue-600 text-5xl mt-2 px-2">{players[0].score} <span className="text-xl font-bold">分</span></div>
            </motion.div>
          </div>

          <div className="flex flex-1 w-full items-center justify-center relative p-8">
            <div className="relative w-full max-w-[120px] aspect-[2.5/3.5]">
              <AnimatePresence>
                {p1Matched.map((card, i) => (
                  <div key={`p1-pile-${card.id}`} className="absolute w-full h-full" style={{ top: i * 4, left: i * 3, zIndex: i }}>
                    <Card
                      card={card}
                      layoutId={`card-${card.id}`}
                      className="absolute shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-full h-full"
                    />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Main Board */}
        <div className="flex-1 flex flex-col relative z-10 w-full min-h-0">
          {/* Header Bar */}
          <div className={`relative w-full shrink-0 z-50 flex justify-between md:justify-center items-center transition-all hidden md:flex ${
            previewCountdown > 0 
              ? "md:p-4 md:min-h-[80px]" 
              : "opacity-0 md:opacity-100 md:p-4 md:min-h-[80px]"
          }`}>
            <div className="hidden md:block absolute left-2 md:left-4">
              <Button variant="outline" size="sm" onClick={onQuit} className="bg-white/80 backdrop-blur-sm shadow-sm md:shadow-md text-xs md:text-base px-2 md:px-4 py-1 md:py-2">
                ⬅️ 放棄遊戲
              </Button>
            </div>
            
            {previewCountdown > 0 && (
              <div className="bg-white/90 backdrop-blur-sm px-3 md:px-6 py-1 md:py-2 rounded-full border-2 md:border-4 border-indigo-400 shadow-sm md:shadow-md flex items-center gap-1.5 md:gap-3 mx-auto">
                <div className="font-bold text-indigo-800 text-base md:text-xl hidden sm:block">👀 記憶時間</div>
                <div className="text-xl md:text-4xl font-extrabold text-orange-500 w-6 md:w-10 text-center">{previewCountdown}</div>
              </div>
            )}
          </div>
          
          <div ref={boardRef} className="flex-1 min-h-0 w-full flex flex-col p-2 md:p-4 md:px-12 md:pb-12 items-center justify-center overflow-hidden">
            <div 
              className={`grid w-full place-items-center m-auto transition-all`}
              style={{
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                maxWidth: gridMaxWidth,
                gap: isMobile ? '6px' : '12px'
              }}
            >
              {cards.map((card, i) => (
                <div key={`slot-${card.id}`} className="w-full aspect-[2.5/3.5] relative">
                  {/* Empty placeholder keeps grid from collapsing when a card moves to a sidebar */}
                  <div className="absolute inset-0 bg-black/5 rounded-[8cqi] border-2 border-black/10 border-dashed mix-blend-multiply opacity-50" style={{ containerType: 'inline-size' }} />
                  
                  {!card.isMatched && (
                    <Card
                      card={card}
                      layoutId={`card-${card.id}`}
                      onClick={() => handleCardClick(i)}
                      className="absolute inset-0 shadow-sm md:shadow-md"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Player 2 Sidebar */}
        <div className="hidden md:flex md:w-[220px] shrink-0 bg-red-100 border-l-4 border-red-200 flex-col items-center justify-start px-4 py-8 shadow-md z-20">
          <div className="flex flex-1 w-full items-center justify-center relative p-8">
            <div className="relative w-full max-w-[120px] aspect-[2.5/3.5]">
              <AnimatePresence>
                {p2Matched.map((card, i) => (
                  <div key={`p2-pile-${card.id}`} className="absolute w-full h-full" style={{ bottom: i * 4, left: i * 3, zIndex: i }}>
                    <Card
                      card={card}
                      layoutId={`card-${card.id}`}
                      className="absolute shadow-[0_4px_12px_rgba(0,0,0,0.15)] w-full h-full"
                    />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col items-center mt-auto w-full">
            <motion.div
              animate={{ scale: currentTurnId === 2 ? 1.05 : 0.95, opacity: currentTurnId === 2 ? 1 : 0.6 }}
              className={`w-full flex-col p-4 rounded-3xl border-[6px] ${currentTurnId === 2 ? 'bg-yellow-100 border-yellow-400 shadow-lg' : 'bg-white border-red-200 text-gray-500'}`}
            >
              <div className="flex flex-col items-center gap-0">
                <AnimatedAvatar emoji={p2Avatar.emoji} score={players[1].score} className="text-7xl justify-center bg-transparent rounded-none w-auto h-auto items-center" />
                <div className="text-center font-bold text-xl uppercase tracking-wider mt-2">{p2Avatar.name}</div>
              </div>
              <div className="text-center font-extrabold text-blue-600 text-5xl mt-2 px-2">{players[1].score} <span className="text-xl font-bold">分</span></div>
            </motion.div>
          </div>
        </div>

      </div>
    </LayoutGroup>
  );
}
