/* eslint-disable react/prop-types */
import { useState } from "react";
import { Avatar, ChannelList } from "stream-chat-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomChannelPreview from "./CustomChannelPreview";
import { LogOut, User, PlusCircle, ChevronsDownUp } from "lucide-react";
import { logoConvo } from "@/assets/images";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function SidebarMenu({ onCreateChat, client, userId }) {
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);

  return (
    <div className="w-80 h-full flex flex-col border-r border-gray-200">
      <div className="w-full p-4 flex items-center justify-between">
        <div className="flex flex-row justify-start items-center gap-2 text-lg font-bold text-primary">
          <img src={logoConvo} alt="Logo" className="h-8 w-auto" />
          CONVO
        </div>
        <Button onClick={onCreateChat} variant="ghost">
          <PlusCircle className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <ChannelList
          className="max-h-full"
          filters={{ members: { $in: [userId] } }}
          sort={{ last_message_at: -1 }}
          Preview={CustomChannelPreview}
          showChannelSearch
        />
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex flex-row items-center justify-between"
            >
              <div className="flex flex-row justify-start">
                <Avatar
                  image={client?.user?.image_url}
                  name={client?.user?.name || client?.user?.id}
                  size={32}
                  shape="rounded"
                />
                <span className="ml-2">
                  {client.user.name || client.user.id}
                </span>
              </div>
              <ChevronsDownUp size={20} strokeWidth={1} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setIsAccountInfoOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Account Info
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => client.disconnectUser()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Account Info Dialog */}
      <Dialog open={isAccountInfoOpen} onOpenChange={setIsAccountInfoOpen}>
        <DialogContent className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="mb-2">
            <DialogTitle>Account Information</DialogTitle>
            <DialogDescription>
              Your Stream Chat account details.
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            <p>
              <strong>Name:</strong> {client.user.name}
            </p>
            <p>
              <strong>Email:</strong> {client.user.email}
            </p>
            <p>
              <strong>ID:</strong> {client.user.id}
            </p>
          </div>

          {/* Footer */}
          <DialogFooter className="mt-4">
            <Button
              onClick={() => setIsAccountInfoOpen(false)}
              variant="primary"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
