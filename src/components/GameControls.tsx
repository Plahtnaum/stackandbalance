import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Pause,
  Play,
  RefreshCw,
  HelpCircle,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";

interface GameControlsProps {
  score?: number;
  highScore?: number;
  difficultyLevel?: number;
  isPlaying?: boolean;
  onRestart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onShowTutorial?: () => void;
}

const GameControls = ({
  score = 0,
  highScore = 0,
  difficultyLevel = 1,
  isPlaying = false,
  onRestart = () => {},
  onPause = () => {},
  onResume = () => {},
  onShowTutorial = () => {},
}: GameControlsProps) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Sound control logic would be implemented here
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <Card className="border-none rounded-none shadow-none bg-transparent">
        <div className="flex items-center justify-between p-4">
          {/* Score Section */}
          <div className="flex items-center space-x-4">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Score</span>
              <span className="text-2xl font-bold">{score}</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">
                  High Score
                </span>
              </div>
              <span className="text-xl font-semibold">{highScore}</span>
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="hidden md:block">
            <Badge variant="outline" className="px-3 py-1">
              Level {difficultyLevel}
            </Badge>
          </div>

          {/* Controls Section */}
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleMute}>
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isMuted ? "Unmute" : "Mute"} sound</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsHelpOpen(true)}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How to play</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={isPlaying ? onPause : onResume}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPlaying ? "Pause game" : "Resume game"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={onRestart}>
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Restart game</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>

      {/* Help Dialog */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>How to Play Stack & Balance</DialogTitle>
            <DialogDescription>
              Stack objects and maintain balance as long as possible!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-full">
                <span className="text-xl">👆</span>
              </div>
              <div>
                <h4 className="font-medium">Tap to Place</h4>
                <p className="text-sm text-muted-foreground">
                  Tap the screen to place the current object on the stack
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-full">
                <span className="text-xl">👋</span>
              </div>
              <div>
                <h4 className="font-medium">Swipe to Rotate</h4>
                <p className="text-sm text-muted-foreground">
                  Swipe left or right to rotate the view around the stack
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-muted p-2 rounded-full">
                <span className="text-xl">🤏</span>
              </div>
              <div>
                <h4 className="font-medium">Pinch to Zoom</h4>
                <p className="text-sm text-muted-foreground">
                  Pinch in or out to zoom the camera view
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button
              className="w-full"
              onClick={() => {
                setIsHelpOpen(false);
                onShowTutorial();
              }}
            >
              Show Interactive Tutorial
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GameControls;
