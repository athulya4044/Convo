/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
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
import {
  LogOut,
  User,
  ChevronsDownUp,
  MoreVertical,
  UserPlus,
  BookOpen,
  Eye,
} from "lucide-react"; 
import { logoConvo } from "@/assets/images";
import { LogOut, User, ChevronsDownUp, MoreVertical } from "lucide-react";
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
}) {
  const [isAccountInfoOpen, setIsAccountInfoOpen] = useState(false);
  const [isGrayscale, setIsGrayscale] = useState(false); 
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
  
    const navigateToChat = async ({ channelId, messageId = null }) => {
      if (!client) return;
  
      try {
        const existingChannels = await client.queryChannels({
          id: { $eq: channelId },
        });
  
        let channel;
  
        if (existingChannels.length > 0) {
          channel = existingChannels[0];
        } else {
          channel = client.channel("messaging", channelId, {
            members: [channelId, client.userID],
          });
          await channel.create();
        }
  
        await channel.watch();
        setActiveChannel(channel);
  
        if (messageId) {
          setTimeout(() => {
            const messageElement = document.getElementById(
              `message-${messageId}`
            );
            if (messageElement && chatContainerRef.current) {
              chatContainerRef.current.scrollTo({
                top: messageElement.offsetTop - 50,
                behavior: "smooth",
              });
            }
          }, 500);
        }
      } catch (error) {
        console.error("Error navigating to chat:", error);
      }
    };

  // Load grayscale state from localStorage on component mount
  useEffect(() => {
    const savedGrayscaleState = localStorage.getItem("isGrayscale") === "true";
    setIsGrayscale(savedGrayscaleState); 
    if (savedGrayscaleState) {
      document.body.classList.add("grayscale"); 
    } else {
      document.body.classList.remove("grayscale");
    }
  }, []);

  const toggleGrayscale = () => {
    const newState = !isGrayscale;
    setIsGrayscale(newState); 
    localStorage.setItem("isGrayscale", newState); 
    if (newState) {
      document.body.classList.add("grayscale");
    } else {
      document.body.classList.remove("grayscale");
    }
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
              <UserPlus className="mr-2 h-4 w-4" />
              Create Group
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/learning-hub")}>
              <BookOpen className="mr-2 h-4 w-4" />
              Learning Hub
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 mr-2"/>
                    Grayscale
                </div>
                <label className="relative inline-flex items-center ml-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isGrayscale}
                    onChange={toggleGrayscale}
                  />
                  <div className="w-8 h-4 bg-gray-200 rounded-full peer-focus:outline-none peer dark:bg-gray-700 peer-checked:bg-blue-600">
                    <span className="absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow-md transition-all peer-checked:translate-x-4"></span>
                  </div>
                </label>
              </div>
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
