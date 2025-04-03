import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox, usePlane } from "@react-three/cannon";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";

interface GameCanvasProps {
  isPlaying: boolean;
  difficultyLevel: number;
  onObjectStacked: () => void;
  onGameOver: () => void;
}

// Base platform
const Platform = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.1, 0],
    type: "Static",
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  );
};

// Stackable object
const StackableObject = ({
  position,
  shape,
  color,
  size,
  onFall,
  isActive,
  onPlaced,
}: {
  position: [number, number, number];
  shape: "box" | "cylinder" | "sphere" | "cone";
  color: string;
  size: number;
  onFall: () => void;
  isActive: boolean;
  onPlaced: () => void;
}) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [size, size, size],
    type: isActive ? "Kinematic" : "Dynamic",
    onCollide: (e) => {
      if (!isActive && e.contact.impactVelocity > 2) {
        onFall();
      }
    },
  }));

  // Handle horizontal movement for active object
  useFrame((state) => {
    if (isActive && api && api.position) {
      const time = state.clock.getElapsedTime();
      const x = Math.sin(time) * 2;
      api.position.set(x, position[1], position[2]);
    }
  });

  // Handle user click to place object
  useEffect(() => {
    const handleClick = () => {
      if (isActive && api && api.type) {
        api.type.set("Dynamic");
        onPlaced();
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isActive, api, onPlaced]);

  // Render different shapes based on the shape prop
  const renderGeometry = () => {
    switch (shape) {
      case "box":
        return <boxGeometry args={[size, size, size]} />;
      case "cylinder":
        return <cylinderGeometry args={[size / 2, size / 2, size, 32]} />;
      case "sphere":
        return <sphereGeometry args={[size / 2, 32, 32]} />;
      case "cone":
        return <coneGeometry args={[size / 2, size, 32]} />;
      default:
        return <boxGeometry args={[size, size, size]} />;
    }
  };

  return (
    <mesh ref={ref} castShadow receiveShadow>
      {renderGeometry()}
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const GameCanvas = ({
  isPlaying,
  difficultyLevel,
  onObjectStacked,
  onGameOver,
}: GameCanvasProps) => {
  const [objects, setObjects] = useState<
    Array<{
      id: number;
      position: [number, number, number];
      shape: "box" | "cylinder" | "sphere" | "cone";
      color: string;
      size: number;
      isActive: boolean;
    }>
  >([]);
  const [nextObjectId, setNextObjectId] = useState(1);
  const [gameState, setGameState] = useState<"playing" | "gameOver">("playing");
  const [fallCount, setFallCount] = useState(0);

  const colors = [
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
    "#536DFE",
    "#448AFF",
    "#40C4FF",
    "#18FFFF",
    "#64FFDA",
    "#69F0AE",
    "#B2FF59",
    "#EEFF41",
    "#FFFF00",
    "#FFD740",
    "#FFAB40",
    "#FF6E40",
  ];

  // Generate a new object based on difficulty level
  const generateNewObject = () => {
    const shapes: Array<"box" | "cylinder" | "sphere" | "cone"> = ["box"];

    // Add more shapes based on difficulty
    if (difficultyLevel >= 2) shapes.push("cylinder");
    if (difficultyLevel >= 3) shapes.push("sphere");
    if (difficultyLevel >= 4) shapes.push("cone");

    // Calculate size (gets smaller as difficulty increases)
    const baseSize = 1;
    const sizeReduction = Math.min(0.4, (difficultyLevel - 1) * 0.08);
    const size = baseSize - sizeReduction;

    // Calculate height based on existing objects
    const stackHeight = objects.length > 0 ? objects.length * size + 2 : 2;

    const newObject = {
      id: nextObjectId,
      position: [0, stackHeight, 0] as [number, number, number],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      size,
      isActive: true,
    };

    setObjects((prev) => [
      ...prev.map((obj) => ({ ...obj, isActive: false })),
      newObject,
    ]);
    setNextObjectId((prev) => prev + 1);
  };

  // Initialize the game with the first object
  useEffect(() => {
    if (isPlaying && objects.length === 0) {
      generateNewObject();
    }
  }, [isPlaying, objects.length]);

  // Handle object placement
  const handleObjectPlaced = () => {
    onObjectStacked();
    setTimeout(() => {
      if (gameState === "playing") {
        generateNewObject();
      }
    }, 1000);
  };

  // Handle object falling off
  const handleObjectFall = () => {
    setFallCount((prev) => prev + 1);

    // Game over if too many objects fall
    if (fallCount >= 2) {
      setGameState("gameOver");
      onGameOver();
    }
  };

  // Reset game state when restarting
  useEffect(() => {
    if (!isPlaying && gameState === "gameOver") {
      setObjects([]);
      setFallCount(0);
      setGameState("playing");
    }
  }, [isPlaying, gameState]);

  return (
    <>
      <Platform />
      {objects.map((object) => (
        <StackableObject
          key={object.id}
          position={object.position}
          shape={object.shape}
          color={object.color}
          size={object.size}
          isActive={object.isActive}
          onFall={handleObjectFall}
          onPlaced={handleObjectPlaced}
        />
      ))}

      {/* Instructions text */}
      <Text
        position={[0, 0.5, -3]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {isPlaying ? "Click to place the object!" : "Game Over!"}
      </Text>
    </>
  );
};

export default GameCanvas;
