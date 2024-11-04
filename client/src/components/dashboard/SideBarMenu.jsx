/* eslint-disable react/prop-types */
import { useState } from "react";
import { ChannelList } from "stream-chat-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import AccountInfo from "./AccountInfo";

export default function SidebarMenu({ onCreateChat, client, userId, logout }) {
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
          // additionalChannelSearchProps={{ searchForChannels: true }}
        />
      </ScrollArea>

      <div className="p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full flex flex-row items-center justify-between"
            >
              <div className="flex flex-row justify-start items-center">
                <div className="h-10 w-10 flex flex-row justify-center items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={client?.user?.image_url}
                      alt={client?.user?.name}
                    />
                    <AvatarFallback className="bg-primary text-white">
                      {client?.user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
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
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Account Info Dialog */}
      <AccountInfo
        client={client}
        isAccountInfoOpen={isAccountInfoOpen}
        setIsAccountInfoOpen={setIsAccountInfoOpen}
      />
    </div>
  );
}
