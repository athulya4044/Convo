import { useState, useEffect, useContext } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import stripSpecialCharacters from "@/utils/stripSpecialCharacters";
import { AppContext } from "@/utils/store/appContext";
import SidebarMenu from "../components/dashboard/SideBarMenu";
import CustomChannelHeader from "../components/dashboard/CustomChannelHeader";
import CreateGroupModal from "../components/dashboard/CreateGroupModal";


const apiKey = "g6dm9he8gx4q";


export default function Dashboard() {
  const _ctx = useContext(AppContext);
  const [client, setClient] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

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

  const handleGroupCreated = async (newChannel) => {
    setChannels((prevChannels) => [newChannel, ...prevChannels]);
  
    const response = await client.queryChannels({ members: { $in: [userId] } });
    setChannels(response);
  };

  if (!client) return <LoadingIndicator size={40} />;

  return (
    <Chat client={client} theme="messaging light">
      <div className="flex h-screen bg-white">
      <SidebarProvider>
          <SidebarMenu
            client={client}
            userId={userId}
            onShowGroupModal={() => setShowCreateGroupModal(true)}
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
          {showCreateGroupModal && (
        <CreateGroupModal
          client={client}
          onClose={() => setShowCreateGroupModal(false)}
          onGroupCreated={handleGroupCreated}
        />
      )} 
    </Chat>
  );
}
