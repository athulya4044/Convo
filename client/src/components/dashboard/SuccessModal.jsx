/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown, X } from "lucide-react";
import { member } from "@/assets/images";
import { FeatureItem } from "./PremiumModal";

export default function SuccessModal({ isOpen, onClose }) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", updateWindowSize);
    updateWindowSize();

    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:w-[40vw]">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold text-primary flex justify-center items-center gap-1">
            Congratulations
            <Crown strokeWidth={2}/>
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            You&apos;re now a premium member!
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={onClose}
          variant="ghost"
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="flex flex-col items-center justify-center space-y-4 p-1">
          <div className="w-full h-[30vh]">
            <img
              loading="eager"
              src={member}
              alt="Premium Member"
              className="h-full w-full object-contain"
            />
          </div>
          <p className="text-center text-lg font-semibold text-primary">
            Welcome to the exclusive club !
          </p>

          <div className="w-full space-y-3">
            <FeatureItem>Unlimited Video Chat</FeatureItem>
            <FeatureItem>Unlimited group chats</FeatureItem>
            <FeatureItem>Advanced AI-powered assistant</FeatureItem>
            <FeatureItem>Priority customer support</FeatureItem>
          </div>
          <Button
            className="w-full flex flex-row justify-center items-center gap-1"
            onClick={() => onClose()}
          >
            Start Exploring
            <ArrowRight strokeWidth={1} />
          </Button>
        </div>
        {isOpen && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
