/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { premium } from "../../assets/images";
import { CheckCircle, Zap } from "lucide-react";

export default function PremiumDialog({ setShowPaymentModal }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="md:max-w-[35vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-3xl font-bold text-primary">
            Convo Premium
            <Zap className="ml-2 h-6 w-6" color="#4A0080"/>
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Unlock exclusive features and elevate your experience
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center my-3">
          <img
            src={premium}
            loading="eager"
            alt="Premium illustration"
            className="w-full h-[200px] object-contain"
          />
        </div>
        <div className="space-y-3">
          <FeatureItem>Unlimited Video Chat</FeatureItem>
          <FeatureItem>Unlimited group chats</FeatureItem>
          <FeatureItem>Advanced AI-powered assistant</FeatureItem>
          <FeatureItem>Priority customer support</FeatureItem>
        </div>
        <DialogFooter className="flex flex-col items-center mt-6">
          <Button
            className="w-full"
            onClick={() => {
              // Add your subscription logic here
              setIsOpen(false);
              setShowPaymentModal();
            }}
          >
            Upgrade Now for $9.99/month
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function FeatureItem({ children }) {
  return (
    <div className="flex items-center space-x-2">
      <CheckCircle className="h-5 w-5 text-green-500" />
      <span>{children}</span>
    </div>
  );
}
