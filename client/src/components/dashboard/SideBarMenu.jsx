/* eslint-disable react/prop-types */
// SidebarMenu.jsx
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
import { LogOut, User, ChevronsDownUp, MoreVertical } from "lucide-react";
import { logoConvo } from "@/assets/images";
import SearchBar from "@/components/dashboard/SearchBar";
import CustomChannelPreview from "./CustomChannelPreview";
import AccountInfo from "./AccountInfo";
import { useNavigate } from "react-router-dom";


export default function SidebarMenu({
  client,
  userId,
  logout,
  onShowGroupModal,
  setActiveChannel,
  navigateToChat, // Pass the navigateToChat function
}) {
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const navigate = useNavigate();

  // Custom sorting function to pin the AI channel at the top
  const customSort = (channels) => {
    const aiChannelId = `${userId}_convoAI`;
    return channels.sort((a, b) => {
      if (a.id === aiChannelId) return -1; // AI channel goes to the top
      if (b.id === aiChannelId) return 1;
      // Default sorting based on last message timestamp
      return b.state.last_message_at - a.state.last_message_at;
    });
  };

  return (
    <div className="w-80 h-full flex flex-col border-r border-gray-200">
      <div className="p-4 flex items-center justify-between">
        <div className="flex flex-row items-center gap-2 text-lg font-bold text-primary">
          <img src={logoConvo} alt="Logo" className="h-8 w-auto" />
          CONVO
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 flex items-center justify-center"
              style={{ color: "hsl(275 100% 25%)" }}
            >
              <MoreVertical size={20} strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onShowGroupModal}>
              Create Group
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/learning-hub")}>
              Learning Hub
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* SearchBar */}
      <div className="sticky top-0 z-20 bg-white p-2 border-b border-gray-300">
        <SearchBar
          client={client}
          userId={userId}
          navigateToChat={navigateToChat}
          className="w-3/4 mx-auto" 
        />
      </div>

      {/* Channel List */}
      <ScrollArea className="flex-1">
        <ChannelList
          className="max-h-full my-4"
          filters={{ members: { $in: [userId] } }}
          sort={{ last_message_at: -1 }}
          Preview={(props) => (
            <CustomChannelPreview
              {...props}
              setActiveChannel={setActiveChannel}
            />
          )}
          channelRenderFilterFn={customSort}
        />
      </ScrollArea>

      {/* Account Info Section */}
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
