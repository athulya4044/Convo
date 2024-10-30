/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CreateChatDialog({ isOpen, onClose }) {
  const handleCreateChat = (type) => {
    onClose();
    console.log(`Creating ${type} chat`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chat</DialogTitle>
          <DialogDescription>
            Select the type of chat you want to create.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button onClick={() => handleCreateChat("one-on-one")}>
            One-on-One Chat
          </Button>
          <Button onClick={() => handleCreateChat("group")}>Group Chat</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
