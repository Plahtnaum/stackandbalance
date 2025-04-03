import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, MousePointerClick, RotateCcw, ZoomIn } from "lucide-react";

interface TutorialOverlayProps {
  onClose: () => void;
}

const TutorialOverlay = ({ onClose }: TutorialOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-background rounded-lg shadow-xl overflow-hidden"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">How to Play</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MousePointerClick className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Click to Place</h3>
                <p className="text-muted-foreground">
                  Click anywhere on the screen to drop the current object onto
                  the stack. Time your click carefully to position it correctly!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <RotateCcw className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Balance is Key</h3>
                <p className="text-muted-foreground">
                  Keep your tower balanced! If objects fall off, you'll lose
                  points. The game ends when your structure becomes too
                  unstable.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <ZoomIn className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Increasing Difficulty</h3>
                <p className="text-muted-foreground">
                  As your score increases, you'll face more challenging shapes
                  and smaller objects. How high can you stack?
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button size="lg" onClick={onClose}>
              Start Playing
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TutorialOverlay;
