import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, RotateCcw, Trophy, Clock, Layers } from "lucide-react";

interface GameOverModalProps {
  isOpen?: boolean;
  score?: number;
  highScore?: number;
  objectsStacked?: number;
  timeSurvived?: number;
  onRestart?: () => void;
  onShare?: () => void;
}

const GameOverModal = ({
  isOpen = true,
  score = 0,
  highScore = 0,
  objectsStacked = 0,
  timeSurvived = 0,
  onRestart = () => {},
  onShare = () => {},
}: GameOverModalProps) => {
  const isNewHighScore = score > 0 && score >= highScore;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 15 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 bg-background/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Game Over</CardTitle>
            <CardDescription>Your tower has collapsed!</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Score display */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-muted-foreground">
                Your Score
              </h3>
              <p className="text-4xl font-bold">{score}</p>

              {isNewHighScore && (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="mt-2"
                >
                  <Badge
                    variant="destructive"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1"
                  >
                    <Trophy className="w-4 h-4 mr-1" /> New High Score!
                  </Badge>
                </motion.div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="flex justify-center mb-1">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Objects Stacked</p>
                <p className="text-xl font-semibold">{objectsStacked}</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="flex justify-center mb-1">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Time Survived</p>
                <p className="text-xl font-semibold">{timeSurvived}s</p>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-sm text-center text-muted-foreground">
                High Score: {highScore}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={onRestart} className="w-full" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Play Again
            </Button>

            <Button variant="outline" onClick={onShare} className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share Score
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default GameOverModal;
