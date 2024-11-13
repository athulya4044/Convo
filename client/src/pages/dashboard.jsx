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

export default function Dashboard() {
  const _ctx = useContext(AppContext);
  const [client, setClient] = useState(null);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  const userId = stripSpecialCharacters(_ctx.email);
  const userToken = _ctx.streamToken;

  useEffect(() => {
    const initChat = async () => {
      const chatClient = StreamChat.getInstance(
        import.meta.env.VITE_STREAM_API_KEY
      );
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

  if (!client)
    return (
      <div className="w-100 h-[100vh] flex flex-row justify-center items-center">
        <LoadingIndicator size={50} />
      </div>
    );

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
