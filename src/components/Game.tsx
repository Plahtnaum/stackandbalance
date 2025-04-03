import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import GameCanvas from "./GameCanvas";
import GameControls from "./GameControls";
import GameOverModal from "./GameOverModal";
import TutorialOverlay from "./TutorialOverlay";

const Game = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [objectsStacked, setObjectsStacked] = useState(0);
  const [timeSurvived, setTimeSurvived] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const gameStartTimeRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem("stackGameHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Start timer when game starts
  useEffect(() => {
    if (isPlaying && !isGameOver) {
      gameStartTimeRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        if (gameStartTimeRef.current) {
          const elapsedSeconds = Math.floor(
            (Date.now() - gameStartTimeRef.current) / 1000,
          );
          setTimeSurvived(elapsedSeconds);
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, isGameOver]);

  // Update difficulty based on score
  useEffect(() => {
    if (score >= 100) setDifficultyLevel(6);
    else if (score >= 80) setDifficultyLevel(5);
    else if (score >= 60) setDifficultyLevel(4);
    else if (score >= 40) setDifficultyLevel(3);
    else if (score >= 20) setDifficultyLevel(2);
    else setDifficultyLevel(1);
  }, [score]);

  const handleGameOver = () => {
    setIsPlaying(false);
    setIsGameOver(true);

    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("stackGameHighScore", score.toString());
    }
  };

  const handleRestart = () => {
    setScore(0);
    setObjectsStacked(0);
    setTimeSurvived(0);
    setIsGameOver(false);
    setIsPlaying(true);
    gameStartTimeRef.current = Date.now();
  };

  const handleObjectStacked = () => {
    setScore((prevScore) => prevScore + 1);
    setObjectsStacked((prevCount) => prevCount + 1);
  };

  const handleShare = () => {
    // Implement share functionality
    if (navigator.share) {
      navigator
        .share({
          title: "Stack & Balance Game",
          text: `I scored ${score} points in Stack & Balance! Can you beat my score?`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert(
        `I scored ${score} points! Share this page to challenge your friends.`,
      );
    }
  };

  return (
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Game Controls */}
      <GameControls
        score={score}
        highScore={highScore}
        difficultyLevel={difficultyLevel}
        isPlaying={isPlaying}
        onRestart={handleRestart}
        onPause={() => setIsPlaying(false)}
        onResume={() => setIsPlaying(true)}
        onShowTutorial={() => setShowTutorial(true)}
      />

      {/* 3D Canvas */}
      <div className="w-full h-full">
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Physics
            gravity={[0, -9.8, 0]}
            defaultContactMaterial={{
              friction: 0.5,
              restitution: 0.2,
            }}
          >
            <GameCanvas
              isPlaying={isPlaying}
              difficultyLevel={difficultyLevel}
              onObjectStacked={handleObjectStacked}
              onGameOver={handleGameOver}
            />
          </Physics>
        </Canvas>
      </div>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        score={score}
        highScore={highScore}
        objectsStacked={objectsStacked}
        timeSurvived={timeSurvived}
        onRestart={handleRestart}
        onShare={handleShare}
      />

      {/* Tutorial Overlay */}
      {showTutorial && (
        <TutorialOverlay onClose={() => setShowTutorial(false)} />
      )}
    </div>
  );
};

export default Game;
