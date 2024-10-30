import { useState, useEffect, useContext } from "react";
import { StreamChat } from "stream-chat";
import {
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
  Chat,
  LoadingIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import stripSpecialCharacters from "@/utils/stripSpecialCharacters";
import { AppContext } from "@/utils/store/appContext";
import SidebarMenu from "../components/dashboard/SideBarMenu";
import CustomChannelHeader from "../components/dashboard/CustomChannelHeader";
import CreateChatDialog from "../components/dashboard/CreateChatDialog";

const apiKey = "g6dm9he8gx4q";

export default function Dashboard() {
  const _ctx = useContext(AppContext);
  const [client, setClient] = useState(null);
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);

  const userId = stripSpecialCharacters(_ctx.email);
  const userToken = _ctx.streamToken;

  useEffect(() => {
    const initChat = async () => {
      const chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser({ id: userId }, userToken);
      setClient(chatClient);
    };

    initChat();

    return () => {
      if (client) client.disconnectUser();
    };
  }, [client, userId, userToken]);

  if (!client) return <LoadingIndicator size={40} />;

  return (
    <Chat client={client} theme="messaging light">
      <div className="flex h-screen bg-white">
        <SidebarProvider>
          <SidebarMenu
            onCreateChat={() => setIsCreateChatOpen(true)}
            client={client}
            userId={userId}
            logout={() => _ctx.logout(client)}
          />
          <div className="my-3 flex-1 flex flex-col">
            <Channel>
              <Window>
                <CustomChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </SidebarProvider>
      </div>

      {/* Create Chat Dialog */}
      <CreateChatDialog
        isOpen={isCreateChatOpen}
        onClose={() => setIsCreateChatOpen(false)}
      />
    </Chat>
  );
}
